import { Body, Container, Head, Hr, Html, Preview, Section, Tailwind, Text } from "@react-email/components";
import type { ReactNode } from "react";

interface EmailLayoutProps {
  previewText: string;
  children: ReactNode;
}

export function EmailLayout({ previewText, children }: EmailLayoutProps) {
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-[#f8fafc] font-sans">
          <Container className="mx-auto my-10 max-w-[480px] rounded-lg bg-white p-8">
            <Text className="text-lg font-semibold text-[#111827]">PARTENARIAT</Text>
            <Hr className="my-4 border-[#e5e7eb]" />
            {children}
            <Hr className="my-4 border-[#e5e7eb]" />
            <Section>
              <Text className="text-xs text-[#6b7280]">
                Este e-mail foi enviado automaticamente pelo PARTENARIAT.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
