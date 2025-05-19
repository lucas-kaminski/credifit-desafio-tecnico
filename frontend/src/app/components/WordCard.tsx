import {
  Box,
  Text,
  Heading,
  Button,
  Flex,
  Link,
  IconButton,
  useToast,
} from '@chakra-ui/react';
import {
  ArrowBackIcon,
  ArrowForwardIcon,
  StarIcon,
  CopyIcon,
} from '@chakra-ui/icons';

interface WordCardProps {
  word: string;
  phonetic?: string;
  meanings?: Array<{ partOfSpeech: string; definitions: string[] }>;
  audioUrls?: string[];
  synonyms?: string[];
  antonyms?: string[];
  sourceUrls?: string[];
  onPrev?: () => void;
  onNext?: () => void;
  onClose?: () => void;
  onSelectSynonym?: (synonym: string) => void;
  onSelectAntonym?: (antonym: string) => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export function WordCard({
  word,
  phonetic,
  meanings,
  audioUrls,
  synonyms,
  antonyms,
  sourceUrls,
  onPrev,
  onNext,
  onClose,
  onSelectSynonym,
  onSelectAntonym,
  isFavorite,
  onToggleFavorite,
}: WordCardProps) {
  const toast = useToast();

  const handleCopyLink = () => {
    const url = `${window.location.origin}?word=${encodeURIComponent(word)}`;
    navigator.clipboard.writeText(url).then(() => {
      toast({
        title: 'Link copiado!',
        description:
          'O link da palavra foi copiado para a área de transferência.',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    });
  };

  return (
    <Box bg="purple.100" p={6} borderRadius="md" boxShadow="md" w="100%">
      <Flex justify="space-between" align="center" mb={2}>
        {onClose && (
          <Button size="sm" variant="ghost" onClick={onClose}>
            X
          </Button>
        )}
        <Flex gap={2}>
          <IconButton
            aria-label="Copiar link"
            icon={<CopyIcon />}
            colorScheme="purple"
            variant="ghost"
            onClick={handleCopyLink}
          />
          {onToggleFavorite && (
            <IconButton
              aria-label={
                isFavorite ? 'Remove from favorites' : 'Add to favorites'
              }
              icon={<StarIcon />}
              colorScheme={isFavorite ? 'yellow' : 'gray'}
              variant={isFavorite ? 'solid' : 'ghost'}
              onClick={onToggleFavorite}
            />
          )}
        </Flex>
      </Flex>
      <Box textAlign="center" py={6}>
        <Heading size="md">{word}</Heading>
        {phonetic && (
          <Text color="gray.600" fontSize="lg">
            {phonetic}
          </Text>
        )}
      </Box>
      <Flex direction="column" align="center" mb={4} gap={2}>
        {audioUrls &&
          audioUrls.map((url, idx) => (
            <audio key={idx} controls src={url} style={{ width: '100%' }}>
              Your browser does not support the audio element.
            </audio>
          ))}
      </Flex>
      <Box mb={4}>
        <Text fontWeight="bold" fontSize="lg">
          Meanings
        </Text>
        {meanings &&
          meanings.map((m, idx) => (
            <Box key={idx} mb={2}>
              <Text fontWeight="semibold" color="purple.700">
                {m.partOfSpeech}
              </Text>
              <ul style={{ marginLeft: 16 }}>
                {m.definitions.map((def, i) => (
                  <li key={i}>
                    <Text as="span">{def}</Text>
                  </li>
                ))}
              </ul>
            </Box>
          ))}
      </Box>
      <Flex gap={2}>
        <Button
          leftIcon={<ArrowBackIcon />}
          onClick={onPrev}
          flex={1}
          variant="outline"
        >
          Anterior
        </Button>
        <Button
          rightIcon={<ArrowForwardIcon />}
          onClick={onNext}
          flex={1}
          colorScheme="purple"
        >
          Próximo
        </Button>
      </Flex>
      {synonyms && synonyms.length > 0 && (
        <Box mt={4}>
          <Text fontWeight="semibold" color="purple.700" mb={1}>
            Synonyms
          </Text>
          <Flex wrap="wrap" gap={2}>
            {synonyms.map((syn, idx) => (
              <Box
                key={idx}
                px={2}
                py={1}
                bg="purple.200"
                borderRadius="md"
                fontSize="sm"
                cursor={onSelectSynonym ? 'pointer' : 'default'}
                _hover={onSelectSynonym ? { bg: 'purple.300' } : undefined}
                onClick={
                  onSelectSynonym ? () => onSelectSynonym(syn) : undefined
                }
              >
                {syn}
              </Box>
            ))}
          </Flex>
        </Box>
      )}
      {antonyms && antonyms.length > 0 && (
        <Box mt={4}>
          <Text fontWeight="semibold" color="red.700" mb={1}>
            Antonyms
          </Text>
          <Flex wrap="wrap" gap={2}>
            {antonyms.map((ant, idx) => (
              <Box
                key={idx}
                px={2}
                py={1}
                bg="red.200"
                borderRadius="md"
                fontSize="sm"
                cursor={onSelectAntonym ? 'pointer' : 'default'}
                _hover={onSelectAntonym ? { bg: 'red.300' } : undefined}
                onClick={
                  onSelectAntonym ? () => onSelectAntonym(ant) : undefined
                }
              >
                {ant}
              </Box>
            ))}
          </Flex>
        </Box>
      )}
      {sourceUrls && sourceUrls.length > 0 && (
        <Box mt={6}>
          <Text fontSize="sm" color="gray.600" mb={2}>
            Fonte{sourceUrls.length > 1 ? 's' : ''}:
          </Text>
          <Flex direction="column" gap={2}>
            {sourceUrls.map((url, idx) => (
              <Link key={idx} href={url} isExternal color="purple.700">
                {url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
              </Link>
            ))}
          </Flex>
        </Box>
      )}
    </Box>
  );
}
