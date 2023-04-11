import { ButtonGroup, Container, IconButton, Stack, Text } from '@chakra-ui/react'
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa'
import { Logo } from './Logo'

/*export const Footer = () => (
  <Container
    as="footer"
    role="contentinfo"
    py={{
      base: '12',
      md: '16',
    }}
  >
    <Stack
      spacing={{
        base: '4',
        md: '5',
      }}
    >
      <Stack justify="space-between" direction="row" align="center">
        <ButtonGroup variant="ghost">
          <IconButton
            as="a"
            href="#"
            aria-label="LinkedIn"
            icon={<FaLinkedin fontSize="1.25rem" />}
          />
          <IconButton as="a" href="#" aria-label="GitHub" icon={<FaGithub fontSize="1.25rem" />} />
          <IconButton
            as="a"
            href="#"
            aria-label="Twitter"
            icon={<FaTwitter fontSize="1.25rem" />}
          />
        </ButtonGroup>
      </Stack>
      <Text fontSize="sm" color="subtle">
        &copy; {new Date().getFullYear()} Smart Vote, Inc. All rights reserved.
      </Text>
    </Stack>
  </Container>
)*/

export const Footer = () => (
    <>
    <div
        style={{
        position: "fixed",
        left: 0,
        bottom: 0,
        right: 0,
        }}
    >
        <Container
            as="footer"
            role="contentinfo"
            py={{
            base: '12',
            md: '16',
            }}
        >
            <Stack
            spacing={{
                base: '4',
                md: '5',
            }}
            >
            <Stack justify="space-between" direction="row" align="center">
                <ButtonGroup variant="ghost">
                <IconButton
                    as="a"
                    href="#"
                    aria-label="LinkedIn"
                    icon={<FaLinkedin fontSize="1.25rem" />}
                />
                <IconButton as="a" href="#" aria-label="GitHub" icon={<FaGithub fontSize="1.25rem" />} />
                <IconButton
                    as="a"
                    href="#"
                    aria-label="Twitter"
                    icon={<FaTwitter fontSize="1.25rem" />}
                />
                </ButtonGroup>
            </Stack>
            <Text fontSize="sm" color="subtle">
                &copy; {new Date().getFullYear()} Smart Vote, Inc. All rights reserved.
            </Text>
            </Stack>
        </Container>
    </div>
    </>
)

