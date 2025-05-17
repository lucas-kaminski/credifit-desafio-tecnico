import { useState } from 'react';
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Box,
  Input,
  Flex,
  Button,
} from '@chakra-ui/react';

interface WordItem {
  word: string;
  created_at?: string;
}

interface WordListTabsProps {
  wordList: string[];
  history: WordItem[];
  favorites: WordItem[];
  onSelectWord: (word: string) => void;
  onSearchWord: (search: string) => void;
  onLoadMore: () => void;
  hasMore: boolean;
  loadingMore: boolean;
  onLoadMoreHistory: () => void;
  onLoadMoreFavorites: () => void;
  hasMoreHistory: boolean;
  hasMoreFavorites: boolean;
  loadingMoreHistory: boolean;
  loadingMoreFavorites: boolean;
}

export function WordListTabs({
  wordList,
  history,
  favorites,
  onSelectWord,
  onSearchWord,
  onLoadMore,
  hasMore,
  loadingMore,
  onLoadMoreHistory,
  onLoadMoreFavorites,
  hasMoreHistory,
  hasMoreFavorites,
  loadingMoreHistory,
  loadingMoreFavorites,
}: WordListTabsProps) {
  const [search, setSearch] = useState('');

  // Filtro só para a aba Word List
  const filteredWords = wordList.filter((w) =>
    w.toLowerCase().includes(search.toLowerCase())
  );

  const renderWordGrid = (words: string[]) => (
    <Box>
      <Input
        placeholder="Search word..."
        mb={4}
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          onSearchWord(e.target.value);
        }}
      />
      <Flex direction="column" gap={4}>
        <Flex wrap="wrap" gap={2}>
          {words.map((word, idx) => (
            <Button
              key={word + '-' + idx}
              size="sm"
              variant="outline"
              colorScheme="purple"
              onClick={() => onSelectWord(word)}
            >
              {word}
            </Button>
          ))}
        </Flex>
        {hasMore && words.length > 0 && (
          <Button
            onClick={onLoadMore}
            isLoading={loadingMore}
            loadingText="Carregando..."
            colorScheme="purple"
            variant="ghost"
            alignSelf="center"
          >
            Carregar mais
          </Button>
        )}
      </Flex>
    </Box>
  );

  const renderHistoryOrFavorites = (
    items: WordItem[],
    hasMore: boolean,
    loadingMore: boolean,
    onLoadMore: () => void
  ) => (
    <Box>
      <Flex direction="column" gap={4}>
        <Flex wrap="wrap" gap={2}>
          {items.map((item, idx) => (
            <Button
              key={item.word + '-' + idx}
              size="sm"
              variant="outline"
              colorScheme="purple"
              onClick={() => onSelectWord(item.word)}
            >
              {item.word}
            </Button>
          ))}
        </Flex>
        {hasMore && items.length > 0 && (
          <Button
            onClick={onLoadMore}
            isLoading={loadingMore}
            loadingText="Carregando..."
            colorScheme="purple"
            variant="ghost"
            alignSelf="center"
          >
            Carregar mais
          </Button>
        )}
      </Flex>
    </Box>
  );

  return (
    <Tabs variant="enclosed" colorScheme="purple" isFitted>
      <TabList>
        <Tab>Word list</Tab>
        <Tab>History</Tab>
        <Tab>Favorites</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>{renderWordGrid(filteredWords)}</TabPanel>
        <TabPanel>
          {renderHistoryOrFavorites(
            history,
            hasMoreHistory,
            loadingMoreHistory,
            onLoadMoreHistory
          )}
        </TabPanel>
        <TabPanel>
          {renderHistoryOrFavorites(
            favorites,
            hasMoreFavorites,
            loadingMoreFavorites,
            onLoadMoreFavorites
          )}
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}
