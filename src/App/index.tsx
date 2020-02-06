import React, { useEffect, useMemo, useState } from "react";
import { createEditor, Node, Editor, Range } from "slate";
import { Slate, Editable, withReact } from "slate-react";

import { Container, EditorStyles } from "./styles";
import { FloatingMenu } from "../FloatingMenu";

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

  useEffect(() => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0).cloneRange();
    range.setStart(sel.anchorNode!, currentWordOffset);
    range.collapse(true);
    setCursorPosition(range.getBoundingClientRect());
  }, [currentWord, currentWordOffset]);

  const handleChange = (value: Node[]): void => {
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

    const currentWordOffset =
      textToSelection.length -
      wordsToSelection[wordsToSelection.length - 1].length;

    setCurrentWord(allWords[currentIndex]);
    setCurrentWordOffset(currentWordOffset);
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
      {cursorPosition && (
        <FloatingMenu
          cursorPosition={cursorPosition}
          currentWord={currentWord}
        />
      )}
    </>
  );
};
