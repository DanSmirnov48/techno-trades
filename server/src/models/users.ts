import mongoose, { ObjectId, Schema } from 'mongoose';
import validator from 'validator'

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