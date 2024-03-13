import mongoose, { Model, ObjectId, Query, Schema, Types, model } from 'mongoose';
import validator from 'validator'
import * as bcrypt from 'bcrypt';
import crypto from 'crypto'

export interface IUser extends Document {
    _id: Types.ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    photo: {
        key: { type: String },
        name: { type: String },
        url: { type: String },
    },
    emailUpdateVerificationCode?: string;
    role: 'user' | 'admin';
    password: string;
    passwordConfirm: string;
    passwordChangedAt?: Date;
    passwordResetToken?: string;
    passwordResetExpires?: Date;
    active: boolean;
    verified: boolean;
    verificationCode?: number;
}

interface IUserMethods {
    correctPassword(candidatePassword: string, userPassword: string): Promise<boolean>;
    changedPasswordAfter(JWTTimestamp: number): boolean;
    checkValidationCode(code: number): boolean;
    createPasswordResetVerificationCode(): string;
    createEmailUpdateVerificationCode(): string;
    checkUserEmailupdateVerificationCode(code: string): boolean;
    checkForgotPasswordVerificationCode(code: string): boolean;
}

type UserModel = Model<IUser, {}, IUserMethods>;

const userSchema = new Schema<IUser, UserModel, IUserMethods>({
    firstName: {
        type: String,
        required: [true, 'A user must have a first name'],
    },
    lastName: {
        type: String,
        required: [true, 'A user must have a last name'],
    },
    email: {
        type: String,
        required: [true, 'A user must have an email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Invalid email address'],
    },
    emailUpdateVerificationCode: String,
    photo: {
        key: { type: String },
        name: { type: String },
        url: { type: String },
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    password: {
        type: String,
        required: [true, 'A user must have a password'],
        minlength: 8,
        select: false,
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            validator: function (this: IUser, value: string) {
                return value === this.password;
            },
            message: 'Passwords do not match!',
        },
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    verificationCode: {
        type: Number,
    }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    // Only run this function if password was actually modified
    if (!this.isModified('password')) return next();

    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);

    // Delete passwordConfirm field
    this.passwordConfirm = undefined as any;
    next();
});

userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = new Date(Date.now() - 1000);
    next();
});

userSchema.pre(/^find/, function (this: Query<IUser[], IUser>, next) {
    // 'this' now refers to the query object
    this.find({ active: { $ne: false } });

    next();
});

userSchema.methods.correctPassword = async function (candidatePassword: string, userPassword: string): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp: number): boolean {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt((this.passwordChangedAt.getTime() / 1000).toString(), 10);
        return JWTTimestamp < changedTimestamp;
    }
    return false;
}

userSchema.methods.checkValidationCode = function (code: number): boolean {
    return this.verificationCode == code;
};

userSchema.methods.createPasswordResetVerificationCode = function (): string {
    const code = crypto.randomBytes(4).toString('hex').toUpperCase();

    this.passwordResetToken = code

    const expirationTime = new Date();
    expirationTime.setMinutes(expirationTime.getMinutes() + 10);

    this.passwordResetExpires = expirationTime;

    return code;
};

userSchema.methods.createEmailUpdateVerificationCode = function (): string {
    const code = crypto.randomBytes(4).toString('hex').toUpperCase();

    this.emailUpdateVerificationCode = code
    return code;
};

userSchema.methods.checkUserEmailupdateVerificationCode = function (code: string): boolean {
    return this.emailUpdateVerificationCode == code;
};

userSchema.methods.checkForgotPasswordVerificationCode = function (code: string): boolean {
    return this.passwordResetToken == code;
};

export const User = mongoose.model<IUser, UserModel>('User', userSchema);

export const getUser = () => User.find()

export const getUserByEmail = (email: string) => User.findOne({ email })

export const getUserBySessionToken = (sessionToken: string) => User.findOne({
    'authentication.sessionToken': sessionToken
})
export const getUserById = (id: string) => User.findById(id)

export const createUser = async (values: Record<string, any>) =>
    new User(values).save().then((user) => user.toObject())

export const deleteUserById = (id: string) => User.findByIdAndDelete(id)

export const updateUserById = (id: string, values: Record<string, any>) =>
    User.findByIdAndUpdate(id, values)