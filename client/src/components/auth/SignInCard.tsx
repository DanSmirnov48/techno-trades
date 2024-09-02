import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { SigninForm } from "@/_auth/forms";

export const SigninCard = () => {
    return (
        <Card className="w-full px-6 py-8 md:px-8 lg:w-1/2 rounded-xl shadow-lg">
            <CardHeader>
                <CardTitle className="mt-3 text-2xl text-center text-gray-600 dark:text-gray-200">Welcome back!</CardTitle>
            </CardHeader>
            <CardContent>
                <SigninForm />
            </CardContent>
            <CardFooter className="flex items-center justify-between mt-5 mb-10">
                <span className="w-1/5 border-b dark:border-gray-600 md:w-1/4"></span>
                <Link to={"/sign-up"} className="text-xs text-gray-500 uppercase dark:text-gray-400 hover:underline">or sign up</Link>
                <span className="w-1/5 border-b dark:border-gray-600 md:w-1/4"></span>
            </CardFooter>
        </Card>
    );
};