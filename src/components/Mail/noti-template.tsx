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

interface NotiTemplateProps {  
  message: string;
}

export const NotiTemplate: React.FC<Readonly<NotiTemplateProps>> = ({  
  message
}) => (
  <Html>
      <Head />
      <Preview>{message}</Preview>
      <Body className="bg-[#f4f4f5] font-sans text-[#1f1f1f]">
        <Container className="bg-white max-w-lg mx-auto p-8 rounded-md shadow-md mt-10">
          <Section className="text-center">
            <Heading className="text-2xl font-semibold mb-2">Nofification</Heading>
            <Text className="text-sm text-gray-600 mb-6">
              
            </Text>

            <div className="bg-gray-100 rounded-md py-4 px-6 inline-block mb-6">
              <Text className="text-2xl font-mono font-bold tracking-widest text-black m-0">
                <Heading className="text-2xl font-semibold mb-2">{message}</Heading>              
              </Text>
            </div>            

            <Text className="text-xs text-gray-400 mt-8">
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
);