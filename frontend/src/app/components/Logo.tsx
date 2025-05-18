import { Box, Text } from '@chakra-ui/react';

export function Logo() {
  return (
    <Box textAlign="center" mb={6}>
      <Text
        fontSize="4xl"
        fontWeight="bold"
        color="purple.700"
        letterSpacing="tight"
      >
        wordz
      </Text>
      <Text fontSize="sm" color="gray.500">
        Seu dicionário de inglês
      </Text>
    </Box>
  );
}
