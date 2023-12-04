import mongoose, { ObjectId, Query, Schema } from 'mongoose';
import validator from 'validator'
import * as bcrypt from 'bcrypt';
import crypto from 'crypto'

export interface UserDocument extends Document {
    _id: ObjectId | string;
    firstName: string;
    lastName: string;
    email: string;
    photo?: string;
    role: 'user' | 'admin';
    password: string;
    passwordConfirm: string;
    passwordChangedAt?: Date;
    passwordResetToken?: string;
    passwordResetExpires?: Date;
    active: boolean;
    correctPassword(candidatePassword: string, userPassword: string): Promise<boolean>;
}

const userSchema: Schema<UserDocument> = new Schema({
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
    photo: String,
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
            validator: function (this: UserDocument, value: string) {
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
});

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

userSchema.pre(/^find/, function (this: Query<UserDocument[], UserDocument>, next) {
    // 'this' now refers to the query object
    this.find({ active: { $ne: false } });

    next();
});

userSchema.methods.correctPassword = async function (
    candidatePassword: string,
    userPassword: string
): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp: number): boolean {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt((this.passwordChangedAt.getTime() / 1000).toString(), 10);
        return JWTTimestamp < changedTimestamp;
    }
    // False means NOT changed
    return false;
}

userSchema.methods.createPasswordResetToken = function () {
    // Generate a secure random token
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    console.log({ resetToken }, this.passwordResetToken);

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

const User = mongoose.model<UserDocument>('User', userSchema);

export default User

export const getUser = () => User.find()

export const getUserByEmail = (email: string) => User.findOne({ email })

export const getUserBySessionToken = (sessionToken: string) => User.findOne({
    'authentication.sessionToken': sessionToken
})
export const getUserById = (id: string) =>
    User.findById(id)

export const createUser = async (values: Record<string, any>) =>
    new User(values).save().then((user) => user.toObject())

export const deleteUserById = (id: string) =>
    User.findByIdAndDelete(id)

export const updateUserById = (id: string, values: Record<string, any>) =>
    User.findByIdAndUpdate(id, values)