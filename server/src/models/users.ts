import { Query, Schema, Types, model } from 'mongoose';
import * as bcrypt from 'bcrypt';

export interface IUser {
    _id: Types.ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    photo: {
        key: { type: String },
        name: { type: String },
        url: { type: String },
    },
    role: 'user' | 'admin';
    password: string;
    isActive: boolean;
    isEmailVerified: boolean;
    otp: number | null;
    otpExpiry: Date;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
    firstName: { type: String, required: true, maxlength: 50 },
    lastName: { type: String, required: true, maxlength: 50 },
    email: { type: String, required: true, unique: true },
    photo: {
        key: { type: String, required: true },
        name: { type: String, required: true },
        url: { type: String, required: true },
    },
    role: { type: String, enum: ['user', 'admin'], default: 'user', },
    password: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    isEmailVerified: { type: Boolean, default: false },
    otp: { type: Number, null: true, blank: true },
    otpExpiry: { type: Date, null: true, blank: true },
}, { timestamps: true });

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

UserSchema.pre(/^find/, function (this: Query<IUser[], IUser>, next) {
    this.find({ active: { $ne: false } });
    next();
});

export const User = model<IUser>('User', UserSchema);