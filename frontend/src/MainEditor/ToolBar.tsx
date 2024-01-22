import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isParagraphNode,
  $isRangeSelection,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND, UNDO_COMMAND
} from "lexical";
import { useCallback, useEffect, useState } from "react"
import { mergeRegister } from '@lexical/utils';

export default function Toolbar() {
  const [editor] = useLexicalComposerContext();

  const [activatedTools, setActivatedTools] = useState<{
    bold: boolean
    italic: boolean
    underline: boolean
    strikethrough: boolean
  }>({
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false
  })
  const [textAlignment, setTextAlignment] = useState<'left' | 'right' | 'center' | 'full'>('left')

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();

    if ($isRangeSelection(selection)) {
      // setIsBold(selection.hasFormat('bold'));
      // setIsItalic(selection.hasFormat('italic'));
      // setIsStrikethrough(selection.hasFormat('strikethrough'));
      // setIsUnderline(selection.hasFormat('underline'));
      setActivatedTools({
        bold: selection.hasFormat('bold'),
        italic: selection.hasFormat('italic'),
        strikethrough: selection.hasFormat('strikethrough'),
        underline: selection.hasFormat('underline'),
      })
      // console.log("style", selection.style)
      selection.getNodes().forEach((node) => {
        // console.log(node.getTextContent(), node.getType())
        // if ($isTextNode(node)) {
        //   const formatType = node.getStyle()
        //   console.log(node.getTextContent(), formatType)
        //   if (formatType === 'justify') {
        //     setTextAlignment("full")
        //   } else if (formatType === "left" || formatType === "right" || formatType === "center") {
        //     setTextAlignment(formatType)
        //   }
        // }

        const parent = node.getParent()
        if (parent && $isParagraphNode(parent)) {
          // console.log("Parent paragraph", parent.getFormatType())
          const formatType = parent.getFormatType()
          // console.log(parent.getTextContent(), formatType)
          if (formatType === 'justify') {
            setTextAlignment("full")
          } else if (formatType === "left" || formatType === "right" || formatType === "center") {
            setTextAlignment(formatType)
          } else {
            setTextAlignment("left")
          }
        }
      })
    }
  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      })
    );
  }, [updateToolbar, editor]);

  return <div className="flex flex-col items-center">
    <div id="toolbar" className="fixed top-2 border mx-auto my-2 flex justify-center text-[#3A3A38] bg-white rounded-lg p-1 shadow-lg">
      {/* Undo, Redo */}
      <ul>
        <button
          onClick={() => {
            editor.dispatchCommand(UNDO_COMMAND, undefined)
          }}>
          <i data-icon-name="Undo_20" aria-hidden="true" className="">
            <svg height="100%" width="100%" viewBox="0,0,2048,2048" focusable="false">
              <path type="path" className="fill-transparent" d="M 1229 102 q 85 0 164 22 q 78 22 146 62 q 68 40 124 96 q 56 56 96 124 q 40 69 62 147 q 22 79 22 164 q 0 77 -16 146 q -16 69 -44 129 q -28 61 -65 113 q -38 52 -80 94 l -744 747 l -75 -73 l 747 -747 q 35 -35 67 -75 q 31 -39 55 -88 q 24 -48 39 -109 q 14 -60 14 -137 q 0 -109 -41 -203 q -42 -93 -113 -162 q -71 -69 -166 -108 q -96 -39 -204 -39 q -89 0 -173 33 q -85 34 -152 102 l -513 479 h 645 v 103 h -819 v -820 h 102 v 642 l 512 -477 q 86 -86 192 -126 q 105 -39 218 -39 z"></path>
              <path type="path" className="fill-[#3A3A38]" d="M 1229 102 q 85 0 164 22 q 78 22 146 62 q 68 40 124 96 q 56 56 96 124 q 40 69 62 147 q 22 79 22 164 q 0 77 -16 146 q -16 69 -44 129 q -28 61 -65 113 q -38 52 -80 94 l -744 747 l -75 -73 l 747 -747 q 35 -35 67 -75 q 31 -39 55 -88 q 24 -48 39 -109 q 14 -60 14 -137 q 0 -109 -41 -203 q -42 -93 -113 -162 q -71 -69 -166 -108 q -96 -39 -204 -39 q -89 0 -173 33 q -85 34 -152 102 l -513 479 h 645 v 103 h -819 v -820 h 102 v 642 l 512 -477 q 86 -86 192 -126 q 105 -39 218 -39 z"></path>
            </svg>
          </i>
        </button>
        <button
          onClick={() => {
            editor.dispatchCommand(REDO_COMMAND, undefined)
          }}>
          <i data-icon-name="Redo_20" aria-hidden="true" className="">
            <svg height="100%" width="100%" viewBox="0,0,2048,2048" focusable="false" style={{ transform: "scale(-1, 1)" }}>
              <path type="path" className="fill-transparent" d="M 1229 102 q 85 0 164 22 q 78 22 146 62 q 68 40 124 96 q 56 56 96 124 q 40 69 62 147 q 22 79 22 164 q 0 77 -16 146 q -16 69 -44 129 q -28 61 -65 113 q -38 52 -80 94 l -744 747 l -75 -73 l 747 -747 q 35 -35 67 -75 q 31 -39 55 -88 q 24 -48 39 -109 q 14 -60 14 -137 q 0 -109 -41 -203 q -42 -93 -113 -162 q -71 -69 -166 -108 q -96 -39 -204 -39 q -89 0 -173 33 q -85 34 -152 102 l -513 479 h 645 v 103 h -819 v -820 h 102 v 642 l 512 -477 q 86 -86 192 -126 q 105 -39 218 -39 z"></path>
              <path type="path" className="fill-[#3A3A38]" d="M 1229 102 q 85 0 164 22 q 78 22 146 62 q 68 40 124 96 q 56 56 96 124 q 40 69 62 147 q 22 79 22 164 q 0 77 -16 146 q -16 69 -44 129 q -28 61 -65 113 q -38 52 -80 94 l -744 747 l -75 -73 l 747 -747 q 35 -35 67 -75 q 31 -39 55 -88 q 24 -48 39 -109 q 14 -60 14 -137 q 0 -109 -41 -203 q -42 -93 -113 -162 q -71 -69 -166 -108 q -96 -39 -204 -39 q -89 0 -173 33 q -85 34 -152 102 l -513 479 h 645 v 103 h -819 v -820 h 102 v 642 l 512 -477 q 86 -86 192 -126 q 105 -39 218 -39 z"></path>
            </svg>
          </i>
        </button>
      </ul>
      {/* Bold, Italic, Underline, Strikethrough */}
      <ul>
        <button
          className={`${activatedTools.bold ? 'selected' : ''}`}
          onClick={() => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
          }}>
          <i data-icon-name="Bold_20" aria-hidden="true" className="">
            <svg
              height="100%"
              width="100%"
              viewBox="0,0,2048,2048"
              focusable="false">
              <path type="path" className="fill-transparent" d="M 1563 1213 q 0 97 -36 175 q -36 79 -104 134 q -68 56 -165 86 q -97 30 -218 30 h -528 v -1433 h 499 q 120 0 212 23 q 92 23 155 66 q 63 44 96 107 q 32 64 32 145 q 0 55 -20 106 q -20 51 -56 93 q -37 43 -88 75 q -51 32 -113 48 v 4 q 73 9 134 38 q 61 29 106 73 q 44 45 69 103 q 25 59 25 127 m -374 -607 q 0 -39 -15 -75 q -15 -35 -44 -62 q -29 -27 -73 -43 q -45 -16 -103 -16 h -135 v 409 h 156 q 25 0 62 -13 q 36 -12 70 -38 q 33 -26 58 -66 q 24 -40 24 -96 m 59 620 q 0 -94 -61 -148 q -62 -54 -178 -54 h -190 v 410 h 188 q 52 0 96 -12 q 44 -11 76 -37 q 32 -25 50 -64 q 18 -39 19 -95 z"></path>
              <path type="path" className="fill-[#3A3A38]" d="M 1563 1213 q 0 97 -36 175 q -36 79 -104 134 q -68 56 -165 86 q -97 30 -218 30 h -528 v -1433 h 499 q 120 0 212 23 q 92 23 155 66 q 63 44 96 107 q 32 64 32 145 q 0 55 -20 106 q -20 51 -56 93 q -37 43 -88 75 q -51 32 -113 48 v 4 q 73 9 134 38 q 61 29 106 73 q 44 45 69 103 q 25 59 25 127 m -374 -607 q 0 -39 -15 -75 q -15 -35 -44 -62 q -29 -27 -73 -43 q -45 -16 -103 -16 h -135 v 409 h 156 q 25 0 62 -13 q 36 -12 70 -38 q 33 -26 58 -66 q 24 -40 24 -96 m 59 620 q 0 -94 -61 -148 q -62 -54 -178 -54 h -190 v 410 h 188 q 52 0 96 -12 q 44 -11 76 -37 q 32 -25 50 -64 q 18 -39 19 -95 z">
              </path>
            </svg>
          </i>
        </button>
        <button
          className={`${activatedTools.italic ? 'selected' : ''}`}
          onClick={() => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
          }}>
          <i data-icon-name="Italic_20" aria-hidden="true" className="">
            <svg height="100%" width="100%" viewBox="0,0,2048,2048" focusable="false">
              <path type="path" className="fill-transparent" d="M 1398 307 h -158 l -261 1229 h 234 l -102 102 h -563 l 102 -102 h 166 l 259 -1229 h -240 l 102 -102 h 563 z"></path>
              <path type="path" className="fill-[#3A3A38]" d="M 1398 307 h -158 l -261 1229 h 234 l -102 102 h -563 l 102 -102 h 166 l 259 -1229 h -240 l 102 -102 h 563 z"></path>
            </svg>
          </i>
        </button>
        <button
          className={`${activatedTools.underline ? 'selected' : ''}`}
          onClick={() => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
          }}>
          <i data-icon-name="Underline_20" aria-hidden="true" className="">
            <svg height="100%" width="100%" viewBox="0,0,2048,2048" focusable="false">
              <path type="path" className="fill-transparent" d="M 410 1843 h 1228 v 103 h -1228 m 1126 -922 q 0 581 -523 581 q -501 0 -501 -559 v -841 h 161 v 832 q 0 422 358 422 q 344 0 344 -409 v -845 h 161 z"></path>
              <path type="path" className="fill-[#3A3A38]" d="M 410 1843 h 1228 v 103 h -1228 m 1126 -922 q 0 581 -523 581 q -501 0 -501 -559 v -841 h 161 v 832 q 0 422 358 422 q 344 0 344 -409 v -845 h 161 z"></path>
            </svg>
          </i>
        </button>
        <button
          className={`${activatedTools.strikethrough ? 'selected' : ''}`}
          onClick={() => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
          }}>
          <i data-icon-name="Strikethrough_20" aria-hidden="true" className="">
            <svg height="100%" width="100%" viewBox="0,0,2048,2048" focusable="false">
              <path type="path" className="fill-transparent" d="M 2048 1126 v 103 h -236 q -9 93 -41 169 q -33 76 -84 129 q -52 53 -120 82 q -69 29 -150 29 q -188 0 -279 -163 h -3 v 143 h -111 v -389 h -205 v 389 h -110 v -158 h -4 q -44 86 -118 132 q -74 46 -169 46 q -63 0 -114 -18 q -52 -18 -88 -51 q -36 -33 -55 -80 q -20 -46 -20 -103 q 0 -94 45 -157 h -186 v -103 h 333 q 24 -8 51 -14 q 26 -5 56 -10 l 269 -39 q 0 -255 -198 -255 q -156 0 -287 113 v -121 q 25 -19 61 -35 q 35 -16 75 -28 q 39 -12 81 -19 q 41 -6 79 -6 q 147 0 223 82 q 76 82 76 248 v 84 h 205 v -819 h 111 v 595 h 3 q 50 -93 133 -142 q 82 -48 185 -48 q 83 0 149 29 q 65 30 112 84 q 46 54 72 130 q 25 77 27 171 m -1107 117 v -14 h -375 q -41 19 -60 57 q -19 38 -19 93 q 0 37 13 67 q 13 30 37 51 q 24 22 58 34 q 34 12 76 12 q 59 0 109 -23 q 49 -23 85 -63 q 36 -40 56 -95 q 20 -55 20 -119 m 463 -275 q -37 74 -37 158 h 567 q -2 -72 -21 -131 q -20 -58 -54 -100 q -35 -41 -83 -64 q -49 -23 -110 -23 q -89 0 -158 42 q -69 43 -104 118 m 452 467 q 59 -79 74 -206 h -563 v 20 q 0 62 21 115 q 21 54 58 94 q 37 40 88 62 q 51 23 111 23 q 133 0 211 -108 z"></path>
              <path type="path" className="fill-[#3A3A38]" d="M 2048 1126 v 103 h -236 q -9 93 -41 169 q -33 76 -84 129 q -52 53 -120 82 q -69 29 -150 29 q -188 0 -279 -163 h -3 v 143 h -111 v -389 h -205 v 389 h -110 v -158 h -4 q -44 86 -118 132 q -74 46 -169 46 q -63 0 -114 -18 q -52 -18 -88 -51 q -36 -33 -55 -80 q -20 -46 -20 -103 q 0 -94 45 -157 h -186 v -103 h 333 q 24 -8 51 -14 q 26 -5 56 -10 l 269 -39 q 0 -255 -198 -255 q -156 0 -287 113 v -121 q 25 -19 61 -35 q 35 -16 75 -28 q 39 -12 81 -19 q 41 -6 79 -6 q 147 0 223 82 q 76 82 76 248 v 84 h 205 v -819 h 111 v 595 h 3 q 50 -93 133 -142 q 82 -48 185 -48 q 83 0 149 29 q 65 30 112 84 q 46 54 72 130 q 25 77 27 171 m -1107 117 v -14 h -375 q -41 19 -60 57 q -19 38 -19 93 q 0 37 13 67 q 13 30 37 51 q 24 22 58 34 q 34 12 76 12 q 59 0 109 -23 q 49 -23 85 -63 q 36 -40 56 -95 q 20 -55 20 -119 m 463 -275 q -37 74 -37 158 h 567 q -2 -72 -21 -131 q -20 -58 -54 -100 q -35 -41 -83 -64 q -49 -23 -110 -23 q -89 0 -158 42 q -69 43 -104 118 m 452 467 q 59 -79 74 -206 h -563 v 20 q 0 62 21 115 q 21 54 58 94 q 37 40 88 62 q 51 23 111 23 q 133 0 211 -108 z"></path>
            </svg>
          </i>
        </button>
      </ul>
      {/* Increase size, decrese size */}
      <ul>
        <button
          onClick={() => {
            // editor.dispatchCommand(INC, '')
          }}>
          <i data-icon-name="GrowFont_20" aria-hidden="true" className="root-94">
            <svg height="100%" width="100%" viewBox="0,0,2048,2048" focusable="false">
              <path type="path" className="fill-transparent" d="M 1229 1638 l -145 -386 h -642 l -140 386 h -148 l 546 -1433 h 134 l 543 1433 m -612 -1283 h -4 q -5 26 -12 51 q -7 25 -16 50 l -246 675 h 552 l -247 -675 q -18 -55 -27 -101 m 1108 157 l -189 -189 l -189 189 l -72 -72 l 261 -262 l 262 261 z"></path>
              <path type="path" className="fill-[#3A3A38]" d="M 1229 1638 l -145 -386 h -642 l -140 386 h -148 l 546 -1433 h 134 l 543 1433 m -612 -1283 h -4 q -5 26 -12 51 q -7 25 -16 50 l -246 675 h 552 l -247 -675 q -18 -55 -27 -101 z"></path>
              <path type="path" className="fill-[#3A3A38]" d="M 1873 512 l -189 -189 l -189 189 l -72 -72 l 261 -262 l 262 261 z"></path>
            </svg>
          </i>
        </button>
        <button
          onClick={() => {
            // editor.dispatchCommand(INC, '')
          }}>
          <i data-icon-name="ShrinkFont_20" aria-hidden="true" className="root-94">
            <svg height="100%" width="100%" viewBox="0,0,2048,2048" focusable="false">
              <path type="path" className="fill-transparent" d="M 1951 278 l -261 261 l -262 -262 l 73 -72 l 189 189 l 188 -189 m -507 1433 h -146 l -110 -289 h -496 l -103 289 h -146 l 430 -1126 h 137 m 134 717 l -185 -504 q -4 -9 -8 -28 q -4 -19 -10 -48 h -4 q -6 47 -17 76 l -184 504 z"></path>
              <path type="path" className="fill-[#3A3A38]" d="M 1371 1638 h -146 l -110 -289 h -496 l -103 289 h -146 l 430 -1126 h 137 m 134 717 l -185 -504 q -4 -9 -8 -28 q -4 -19 -10 -48 h -4 q -6 47 -17 76 l -184 504 z"></path>
              <path type="path" className="fill-[#3A3A38]" d="M 1951 278 l -261 261 l -262 -262 l 73 -72 l 189 189 l 188 -189 z"></path>
            </svg>
          </i>
        </button>
      </ul>
      {/* Alignment left, center, right, full */}
      <ul>
        <button
          className={`${textAlignment === 'left' ? 'selected' : ''}`}
          onClick={() => {
            // setTextAlignment('left')
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')
          }}
        >
          <i data-icon-name="LeftAlign_20" aria-hidden="true" className="root-94">
            <svg height="100%" width="100%" viewBox="0,0,2048,2048" focusable="false">
              <path type="path" className="fill-transparent" d="M 102 205 v -103 h 1844 v 103 m -410 307 v 102 h -1434 v -102 m 1434 819 v 103 h -1434 v -103 m 1844 -409 v 102 h -1844 v -102 m 1844 819 v 102 h -1844 v -102 z"></path>
              <path type="path" className="fill-[#3A3A38]" d="M 102 205 v -103 h 1844 v 103 m -410 307 v 102 h -1434 v -102 m 1434 819 v 103 h -1434 v -103 m 1844 -409 v 102 h -1844 v -102 m 1844 819 v 102 h -1844 v -102 z"></path>
            </svg>
          </i>
        </button>
        <button
          className={`${textAlignment === 'center' ? 'selected' : ''}`}
          onClick={() => {
            // setTextAlignment('center')
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center')
          }}
        >
          <i data-icon-name="Centered_20" aria-hidden="true" className="root-94">
            <svg height="100%" width="100%" viewBox="0,0,2048,2048" focusable="false">
              <path type="path" className="fill-transparent" d="M 102 102 h 1844 v 103 h -1844 m 0 1536 h 1844 v 102 h -1844 m 205 -1331 h 1434 v 102 h -1434 m -205 308 h 1844 v 102 h -1844 m 205 307 h 1434 v 103 h -1434 z"></path>
              <path type="path" className="fill-[#3A3A38]" d="M 102 102 h 1844 v 103 h -1844 m 0 1536 h 1844 v 102 h -1844 m 205 -1331 h 1434 v 102 h -1434 m -205 308 h 1844 v 102 h -1844 m 205 307 h 1434 v 103 h -1434 z"></path>
            </svg>
          </i>
        </button>
        <button
          className={`${textAlignment === 'right' ? 'selected' : ''}`}
          onClick={() => {
            // setTextAlignment('right')
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right')
          }}
        >
          <i data-icon-name="RightAlign_20" aria-hidden="true" className="root-94">
            <svg height="100%" width="100%" viewBox="0,0,2048,2048" focusable="false">
              <path type="path" className="fill-transparent" d="M 102 205 v -103 h 1844 v 103 m -1434 307 h 1434 v 102 h -1434 m 0 717 h 1434 v 103 h -1434 m -410 -512 h 1844 v 102 h -1844 m 0 717 h 1844 v 102 h -1844 z"></path>
              <path type="path" className="fill-[#3A3A38]" d="M 102 205 v -103 h 1844 v 103 m -1434 307 h 1434 v 102 h -1434 m 0 717 h 1434 v 103 h -1434 m -410 -512 h 1844 v 102 h -1844 m 0 717 h 1844 v 102 h -1844 z"></path>
            </svg>
          </i>
        </button>
        <button
          className={`${textAlignment === 'full' ? 'selected' : ''}`}
          onClick={() => {
            // setTextAlignment('full')
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify')
          }}
        >
          <i data-icon-name="FullAlign_20" aria-hidden="true" className="root-94">
            <svg height="100%" width="100%" viewBox="0,0,2048,2048" focusable="false">
              <path type="path" className="fill-transparent" d="M 102 102 h 1844 v 103 h -1844 m 0 307 h 1844 v 102 h -1844 m 0 717 h 1844 v 103 h -1844 m 0 -512 h 1844 v 102 h -1844 m 0 717 h 1844 v 102 h -1844 z"></path>
              <path type="path" className="fill-[#3A3A38]" d="M 102 102 h 1844 v 103 h -1844 m 0 307 h 1844 v 102 h -1844 m 0 717 h 1844 v 103 h -1844 m 0 -512 h 1844 v 102 h -1844 m 0 717 h 1844 v 102 h -1844 z"></path>
            </svg>
          </i>
        </button>
      </ul>
    </div>
  </div>
}
