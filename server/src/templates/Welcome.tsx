import {
    Body,
    Button,
    Container,
    Head,
    Hr,
    Html,
    Img,
    Preview,
    Section,
    Text,
} from "@react-email/components";
import * as React from "react";
import { ImageUrl } from "../templates";

interface WelcomeEmailProps {
    name: string;
}

export const WelcomeEmail = ({ name }: WelcomeEmailProps) => (
    <Html>
        <Head />
        <Preview>TechoTrades Account</Preview>
        <Body style={main}>
            <Container style={container}>
                <Img
                    src={ImageUrl}
                    width="170"
                    height="50"
                    alt="Koala"
                    style={logo}
                />
                <Text style={paragraph}>Hi {name},</Text>
                <Text style={paragraph}>
                    Welcome to TechnoTrades, your new destination for the latest and
                    greatest in electronics! We’re excited to have you on board and can’t
                    wait to help you find the perfect tech gear to suit your lifestyle.
                </Text>
                <Text style={paragraphBold}>
                    To kick things off, here’s a special welcome offer: Enjoy 10% off your
                    first purchase with code WELCOME10.
                </Text>
                <Text style={paragraph}>
                    Simply browse, add your favorites to the cart, and enjoy an easy
                    checkout experience. We’re here to make your tech shopping smooth and
                    enjoyable! If you ever need help, feel free to reply to this email or
                    reach out to our support team.
                </Text>
                <Section style={btnContainer}>
                    <Button style={button} href="https://getkoala.com">
                        Get started
                    </Button>
                </Section>
                <Text style={paragraph}>
                    Welcome aboard, and happy shopping!
                    <br />
                    TechnoTrades Team
                </Text>
                <Hr style={hr} />
                <Text style={footer}>
                    470 Noor Ave STE B #1148, South San Francisco, CA 94080
                </Text>
            </Container>
        </Body>
    </Html>
);

WelcomeEmail.PreviewProps = {
    name: "Alan",
} as WelcomeEmailProps;

export default WelcomeEmail;

const main = {
    backgroundColor: "#ffffff",
    fontFamily:
        '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
    margin: "0 auto",
    padding: "20px 0 48px",
};

const logo = {
    margin: "0 auto",
};

const paragraph = {
    fontSize: "16px",
    lineHeight: "26px",
};

const paragraphBold = {
    fontSize: "16px",
    lineHeight: "26px",
    fontWeight: "bold",
};

const btnContainer = {
    textAlign: "center" as const,
};

const button = {
    backgroundColor: "#5F51E8",
    borderRadius: "3px",
    color: "#fff",
    fontSize: "16px",
    textDecoration: "none",
    textAlign: "center" as const,
    display: "block",
    padding: "12px",
};

const hr = {
    borderColor: "#cccccc",
    margin: "20px 0",
};

const footer = {
    color: "#8898aa",
    fontSize: "12px",
};
