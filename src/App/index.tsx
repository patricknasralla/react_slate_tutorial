import React, { useEffect, useMemo, useState } from "react";
import { createEditor, Node, Editor, Range } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import AwesomeDebouncePromise from "awesome-debounce-promise";

import { Container, EditorStyles } from "./styles";
import { FloatingMenu } from "../FloatingMenu";

const searchThesaurus = (word: string) =>
  fetch(`https://api.datamuse.com/words?ml=${word}&max=10`);
const searchThesaurusDebounced = AwesomeDebouncePromise(searchThesaurus, 500);

interface apiResult {
  word: string;
  score: number;
  tags: string[];
}

export const App: React.FC = () => {
  const editor = useMemo(() => withReact(createEditor()), []);
  const [value, setValue] = useState<Node[]>([
    {
      type: "paragraph",
      children: [{ text: "A line of text in a paragraph." }]
    }
  ]);
  const [cursorPosition, setCursorPosition] = useState<DOMRect | null>(null);
  const [currentWord, setCurrentWord] = useState("");
  const [currentWordOffset, setCurrentWordOffset] = useState(0);
  const [loadingResults, setLoadingResults] = useState(false);
  const [thesaurusResults, setThesaurusResults] = useState<string[]>([]);

  useEffect(() => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0).cloneRange();
    range.setStart(sel.anchorNode!, currentWordOffset);
    range.collapse(true);
    setCursorPosition(range.getBoundingClientRect());
  }, [currentWord, currentWordOffset]);

  const handleChange = async (value: Node[]) => {
    setValue(value);
    if (!editor.selection) return;
    const [node] = Editor.node(editor, editor.selection);
    if (!node.text) return;
    const textToSelection = node.text.slice(
      0,
      Range.start(editor.selection).offset
    );
    const allWords = node.text.split(/\W/);
    const wordsToSelection = textToSelection.split(/\W/);
    const currentIndex = wordsToSelection.length - 1;
    const currentWord = allWords[currentIndex];

    const currentWordOffset =
      textToSelection.length -
      wordsToSelection[wordsToSelection.length - 1].length;

    setCurrentWord(currentWord);
    setCurrentWordOffset(currentWordOffset);

    setLoadingResults(true);
    await searchThesaurusDebounced(currentWord)
      .then(response => response.json())
      .then((results: apiResult[]) => {
        setThesaurusResults(results.map(result => result.word));
        setLoadingResults(false);
      });
  };

  return (
    <>
      <Container>
        <EditorStyles>
          <Slate
            editor={editor}
            value={value}
            onChange={value => handleChange(value)}
          >
            <Editable />
          </Slate>
        </EditorStyles>
      </Container>
      {!loadingResults && cursorPosition && (
        <FloatingMenu
          cursorPosition={cursorPosition}
          currentWords={thesaurusResults}
        />
      )}
    </>
  );
};
