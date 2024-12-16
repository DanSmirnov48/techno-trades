import { Expose } from "class-transformer";
import { Example } from "./utils";
import { IsEmail, IsNotEmpty, IsNumber, Length, Max, Min } from "class-validator";
import { EmailSchema } from "./base";

export class RegisterSchema {
    @Example('John')
    @Expose()
    @Length(3, 50)
    firstName?: string;

    @Example('Doe')
    @Expose()
    @Length(3, 50)
    lastName?: string;

    @Example('johndoe@example.com')
    @Expose()
    @IsEmail({}, { message: "Enter a valid email address" })
    email?: string;

    @Example('strongpassword')
    @Expose()
    @Length(8, 50)
    password?: string;
}

export class VerifyEmailSchema extends EmailSchema {
    @Example(123456)
    @Expose()
    @Min(100000)
    @Max(999999)
    @IsNumber()
    otp?: number;
}

export class SetNewPasswordSchema extends VerifyEmailSchema {
    @Example("newstrongpassword")
    @Expose()
    @Length(8, 50)
    password?: string;
}

export class LoginSchema {
    @Example('johndoe@example.com')
    @Expose()
    @IsEmail({}, { message: "Enter a valid email address" })
    email?: string;

    @Example("password")
    @Expose()
    @Length(8, 50)
    password?: string;
}

export class OtpLoginSchema {
    @Example('johndoe@example.com')
    @Expose()
    @IsEmail({}, { message: "Enter a valid email address" })
    email?: string;

    @Example(123456)
    @Expose()
    @Min(100000)
    @Max(999999)
    @IsNumber()
    otp?: number;
}

const TOKEN_EXAMPLE = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"

export class TokensSchema {
    @Example(TOKEN_EXAMPLE)
    @Expose()
    access?: string;

    @Example(TOKEN_EXAMPLE)
    @Expose()
    refresh?: string;
}

export class RefreshTokenSchema {
    @Example(TOKEN_EXAMPLE)
    @Expose()
    refresh?: string;
}

export class TokenSchema {
    @Example(TOKEN_EXAMPLE)
    @Expose()
    token?: string;
}