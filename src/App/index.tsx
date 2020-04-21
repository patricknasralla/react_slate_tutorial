import React, { KeyboardEvent, useEffect, useMemo, useState } from "react";
import { createEditor, Node, Editor, Range, Transforms } from "slate";
import { Slate, Editable, withReact, ReactEditor } from "slate-react";
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
  const [currentWordRange, setCurrentWordRange] = useState<Range | null>(null);
  const [loadingResults, setLoadingResults] = useState(false);
  const [thesaurusResults, setThesaurusResults] = useState<string[]>([]);
  const [menuIndex, setMenuIndex] = useState(0);

  useEffect(() => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0).cloneRange();
    const offset = currentWordRange ? currentWordRange.anchor.offset : 0;
    range.setStart(sel.anchorNode!, offset);
    range.collapse(true);
    setCursorPosition(range.getBoundingClientRect());
  }, [currentWordRange]);

  function updateCurrentWord() {
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

    setCurrentWordRange({
      anchor: {
        path: editor.selection.anchor.path,
        offset: currentWordOffset
      },
      focus: {
        path: editor.selection.focus.path,
        offset: currentWordOffset + currentWord.length
      },
      word: currentWord
    });

    // don't make a request if the word hasn't changed!
    if (!currentWordRange || currentWord === currentWordRange.word) return;
    setLoadingResults(true);
    setMenuIndex(0);
    searchThesaurusDebounced(currentWord)
      .then(response => response.json())
      .then((results: apiResult[]) => {
        setThesaurusResults(results.map(result => result.word));
        setLoadingResults(false);
      });
  }

  const handleChange = (value: Node[]) => {
    setValue(value);
    updateCurrentWord();
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    // make sure the thesaurus is displayed first and that it contains words
    if (loadingResults || !thesaurusResults.length) return;

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setMenuIndex(prevState => (prevState + 1) % thesaurusResults.length);
        break;
      case "ArrowUp":
        event.preventDefault();
        setMenuIndex(prevState => {
          if (prevState - 1 < 0) return thesaurusResults.length - 1;
          return prevState - 1;
        });
        break;
      case "Enter": {
        event.preventDefault();
        handleInsertWord(menuIndex);
        break;
      }
    }
  };

  const handleInsertWord = (index: number) => {
    if (!currentWordRange) throw new Error("No Range found!");

    const stringToInsert = thesaurusResults[index];
    // replace the word with the newly selected one:
    Transforms.insertText(editor, stringToInsert, {
      at: currentWordRange
    });

    // set the selection to be at the end of the newly inserted word.
    Transforms.select(editor, {
      path: currentWordRange.anchor.path,
      offset: currentWordRange.anchor.offset + stringToInsert.length
    });

    // focus back on the editor
    ReactEditor.focus(editor);

    // update the current word to reflect the change
    updateCurrentWord();
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
            <Editable onKeyDown={(e: KeyboardEvent) => handleKeyDown(e)} />
          </Slate>
        </EditorStyles>
      </Container>
      {!loadingResults && cursorPosition && (
        <FloatingMenu
          cursorPosition={cursorPosition}
          currentWords={thesaurusResults}
          onClick={index => handleInsertWord(index)}
          onMouseOver={index => setMenuIndex(index)}
          menuIndex={menuIndex}
        />
      )}
    </>
  );
};
