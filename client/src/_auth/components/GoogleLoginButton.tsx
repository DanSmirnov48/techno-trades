import { Context, GoogleLogin, GsiButtonConfiguration } from '@react-oauth/google';
import { CredentialResponse } from '@react-oauth/google';
import { useGoogleLogin as LoginMutate } from '../lib/queries';


interface GoogleLoginButtonProps {
    text?: GsiButtonConfiguration['text'];
    context?: Context | undefined
}

export default function GoogleLoginButton({ text = "signin_with", context = "signin" }: GoogleLoginButtonProps) {
    const { mutateAsync, error } = LoginMutate()

    const onSuccess = async (credentialResponse: CredentialResponse) => {
        if (credentialResponse.credential) {
            mutateAsync({ token: credentialResponse.credential })
        }
    };

    return (
        <div className="w-full">
            <GoogleLogin
                onSuccess={onSuccess}
                onError={() => {
                    console.error('Google Login Failed');
                }}
                useOneTap
                theme="outline"
                size="large"
                shape="rectangular"
                locale="en"
                context={context}
                text={text}
            />
            {error && (
                <div className="text-red-500 text-sm mt-2">
                    {error.message}
                </div>
            )}
        </div>
    );
}