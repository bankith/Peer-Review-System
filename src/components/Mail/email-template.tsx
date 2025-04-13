import * as React from 'react';
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Button,
  Hr,
  Img,
} from '@react-email/components';

interface EmailTemplateProps {  
  otpPin: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({  
  otpPin
}) => (
  <Html>
      <Head />
      <Preview>Your confirmation code is {otpPin}</Preview>
      <Body className="bg-[#f4f4f5] font-sans text-[#1f1f1f]">
        <Container className="bg-white max-w-lg mx-auto p-8 rounded-md shadow-md mt-10">
          <Section className="text-center">
            <Heading className="text-2xl font-semibold mb-2">OTP Verification</Heading>
            <Text className="text-sm text-gray-600 mb-6">
              Please enter this confirmation code
            </Text>

            <div className="bg-gray-100 rounded-md py-4 px-6 inline-block mb-6">
              <Text className="text-2xl font-mono font-bold tracking-widest text-black m-0">
                <Heading className="text-2xl font-semibold mb-2">{otpPin}</Heading>              
              </Text>
            </div>            

            <Text className="text-xs text-gray-400 mt-8">
              This code will expire in {3} minutes.<br />
              If you didn’t request this, you can safely ignore this email.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
);