"use client";
import React, { use, useCallback, useState } from "react";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { BubbleMenu, FloatingMenu } from "@tiptap/react/menus";
import { Button } from "@/components/ui/button";
import Blockquote from "@tiptap/extension-blockquote";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Code,
  ImageIcon,
  LinkIcon,
  ListIcon,
  ListOrderedIcon,
  Redo,
  TextQuote,
  Undo,
  XIcon,
} from "lucide-react";
import { Placeholder } from '@tiptap/extensions'
import { Input } from "@/components/ui/input";
import { Link } from "@tiptap/extension-link";
import Heading from "@tiptap/extension-heading";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { all, createLowlight } from "lowlight";
import "highlight.js/styles/github-dark.css";
import TextAlign from "@tiptap/extension-text-align";
import Youtube from "@tiptap/extension-youtube";
import { FaYoutube } from "react-icons/fa";
import { BulletList, ListItem, OrderedList } from "@tiptap/extension-list";
import Image from "@tiptap/extension-image";

const Write = () => {
  const [blogTitle, setBlogTitle] = useState("");
  const [blogDescription, setBlogDescription] = useState("");
  const [openLink, setOpenLink] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const lowlight = createLowlight(all);
  const [height, setHeight] = React.useState(480);
  const [width, setWidth] = React.useState(640);
  const [youtubeOpenLink, setYoutubeOpenLink] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [imageOpenLink, setImageOpenLink] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageWidth, setImageWidth] = useState(320);
  const [imageHeight, setImageHeight] = useState(180);

  const editor = useEditor({
    content: blogDescription,
    extensions: [
      StarterKit.configure({
        horizontalRule: false,
        orderedList: false,
        listItem: false,
        bulletList: false,
      }),
      Blockquote.configure({
        HTMLAttributes: {
          class: "border-l-4 border-gray-300 pl-4 italic", 
        },
      }),
      Link.configure({
        openOnClick: true,
        autolink: true,
        defaultProtocol: "https",
        protocols: ["http", "https"],
        isAllowedUri: (url, ctx) => {
          try {
            const parsedUrl = url.includes(":")
              ? new URL(url)
              : new URL(`${ctx.defaultProtocol}://${url}`);
            if (!ctx.defaultValidate(parsedUrl.href)) {
              return false;
            }
            const disallowedProtocols = ["ftp", "file", "mailto"];
            const protocol = parsedUrl.protocol.replace(":", "");

            if (disallowedProtocols.includes(protocol)) {
              return false;
            }
            const allowedProtocols = ctx.protocols.map((p) =>
              typeof p === "string" ? p : p.scheme
            );

            if (!allowedProtocols.includes(protocol)) {
              return false;
            }
            return true;
          } catch {
            return false;
          }
        },
        shouldAutoLink: (url) => {
          try {
            // construct URL
            const parsedUrl = url.includes(":")
              ? new URL(url)
              : new URL(`https://${url}`);

            // only auto-link if the domain is not in the disallowed list
            const disallowedDomains = [
              "example-no-autolink.com",
              "another-no-autolink.com",
            ];
            const domain = parsedUrl.hostname;

            return !disallowedDomains.includes(domain);
          } catch {
            return false;
          }
        },
        HTMLAttributes: {
          class: "underline text-blue-600 cursor-pointer hover:text-blue-800",
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
      Heading.configure({
        levels: [1, 2, 3, 4, 5, 6],
        HTMLAttributes: {
          class: "heading-element",
        },
      }),
      HorizontalRule,
      CodeBlockLowlight.configure({
        lowlight,
        defaultLanguage: "javascript",
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder: "Write something …",
      }),
      Youtube.configure({
        controls: false,
        nocookie: true,
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: "list-decimal list-outside ml-4",
        },
        keepMarks: true,
        keepAttributes: true,
      }),
      ListItem.configure({
        HTMLAttributes: {
          class: "my-1",
        },
      }),
      BulletList.configure({
        HTMLAttributes: {
          class: "list-disc list-outside ml-4", // Style for unordered list
        },
        keepMarks: true,
        keepAttributes: true,
      }),
      Image.configure({
        inline: true,
        HTMLAttributes: {
          class: "object-cover my-2", // Removed fixed dimensions
        },
      }),
    ],
    editable: true,
    immediatelyRender: false,
    onUpdate({ editor }) {
      setBlogDescription(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "w-full h-full overflow-y-auto mb-8 outline-none text-md font-normal caret-black flex-1 h-[60vh]",
      },
    },
  });

  const editorState = useEditorState({
    editor,
    selector: (ctx) => {
      return {
        canUndo: ctx?.editor?.can().chain().focus().undo().run(),
        canRedo: ctx?.editor?.can().chain().focus().redo().run(),
      };
    },
  });

  const addYoutubeVideo = useCallback(() => {
    if (youtubeUrl) {
      editor?.commands.setYoutubeVideo({
        src: youtubeUrl,
        width: Math.max(320, parseInt(String(width), 10)) || 640,
        height: Math.max(180, parseInt(String(height), 10)) || 480,
      });
    }
  }, [editor, youtubeUrl, height, width]);

  const addImage = useCallback(() => {
    if (imageUrl) {
      editor
        ?.chain()
        .focus()
        .setImage({
          src: imageUrl,
          width: Math.max(100, parseInt(String(imageWidth), 10)) || 320,
          height: Math.max(100, parseInt(String(imageHeight), 10)) || 180,
        })
        .run();
      setImageOpenLink(false);
      setImageUrl("");
      setImageWidth(320);
      setImageHeight(180);
    }
  }, [editor, imageUrl, imageWidth, imageHeight]);

  const canUndo = editorState?.canUndo ?? false;
  const canRedo = editorState?.canRedo ?? false;

  const getCurrentHeadingLevel = () => {
    if (!editor) return null;

    for (let level = 1; level <= 6; level++) {
      if (editor.isActive("heading", { level })) {
        return level;
      }
    }
    return null;
  };

  const cycleHeading = () => {
    if (!editor) return;

    const currentLevel = getCurrentHeadingLevel();

    if (currentLevel === null) {
      editor.chain().focus().toggleHeading({ level: 1 }).run();
    } else if (currentLevel < 6) {
      editor
        .chain()
        .focus()
        .toggleHeading({ level: (currentLevel + 1) as any })
        .run();
    } else {
      editor.chain().focus().setParagraph().run();
    }
  };

  const getHeadingButtonText = () => {
    const currentLevel = getCurrentHeadingLevel();
    return currentLevel ? `H${currentLevel}` : "H";
  };

  return (
    <main className="flex flex-col gap-4 flex-1 items-center h-screen ">
      <div className="flex flex-col h-full flex-1 relative  items-center max-w-2xl w-full">
        <input
          onChange={(e) => setBlogTitle(e.currentTarget.value)}
          value={blogTitle}
          type="text"
          placeholder="Add A Title..."
          className="py-5 w-full outline-0 ring-0 focus-visible:ring-0 placeholder:text-neutral-400 text-black text-2xl"
        />
        <div className="w-full h-full flex-1   relative">
          <EditorContent

            placeholder="Start Writing..."
            className="list-disc list-inside flex-1 min-h-[400px] w-full h-full overflow-y-auto ProseMirror scrollbar-transparent_tiptap placeholder:text-black"
            style={{
              whiteSpace: "pre-line",
              overflowY: "auto",
            }}
            editor={editor}
          />
          <style
            dangerouslySetInnerHTML={{
              __html: `
              .ProseMirror h1 {
                font-size: 1.875rem !important;
                font-weight: bold !important;
                line-height: 2.25rem !important;
                margin: 1rem 0 !important;
              }
              .ProseMirror h2 {
                font-size: 1.5rem !important;
                font-weight: bold !important;
                line-height: 2rem !important;
                margin: 0.75rem 0 !important;
              }
              .ProseMirror h3 {
                font-size: 1.25rem !important;
                font-weight: bold !important;
                line-height: 1.75rem !important;
                margin: 0.5rem 0 !important;
              }
              .ProseMirror h4 {
                font-size: 1.125rem !important;
                font-weight: bold !important;
                line-height: 1.625rem !important;
                margin: 0.5rem 0 !important;
              }
              .ProseMirror h5 {
                font-size: 1rem !important;
                font-weight: bold !important;
                line-height: 1.5rem !important;
                margin: 0.25rem 0 !important;
              }
              .ProseMirror h6 {
                font-size: 0.875rem !important;
                font-weight: bold !important;
                line-height: 1.25rem !important;
                margin: 0.25rem 0 !important;
              }
              .ProseMirror p {
                margin: 0.5rem 0 !important;
                font-size: 1rem !important;
                line-height: 1.5rem !important;
              }
              .ProseMirror ol { list-style-type: decimal !important; margin-left: 1.5rem !important; padding-left: 0 !important; }
              .ProseMirror ol li { margin: 0.25rem 0 !important; }
            `,
            }}
          />
          <div className="absolute top-6 right-6 flex items-center space-x-5 ">
            <Button
              onClick={() => editor?.chain().focus().undo().run()}
              disabled={!canUndo}
              className="rounded-full flex items-center justify-center p-5 cursor-pointer"
            >
              <Undo stroke="white" size={16} />
            </Button>
            <Button
              onClick={() => editor?.chain().focus().redo().run()}
              disabled={!canRedo}
              className="rounded-full flex items-center justify-center p-5 cursor-pointer"
            >
              <Redo stroke="white" size={16} />
            </Button>
          </div>
        </div>
        {editor && (
          <BubbleMenu
            editor={editor}
            className="bubble-menu flex flex-row items-center gap-1 bg-stone-950 rounded-md px-3 py-2 max-w-[320px] overflow-x-auto  no-scrollbar"
          >
            {openLink ? (
              <div className="flex flex-row space-x-4  items-center">
                <Input
                  className=" text-white w-64 border-0 focus-visible:ring-0"
                  onChange={(e) => {
                    setLinkUrl(e.target.value);
                  }}
                  placeholder="Add Link..."
                  value={linkUrl}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      if (linkUrl) {
                        editor
                          .chain()
                          .focus()
                          .extendMarkRange("link")
                          .setLink({ href: linkUrl })
                          .run();
                      } else {
                        editor.chain().focus().unsetLink().run();
                      }
                      setOpenLink(false);
                    }
                    if (e.key === "Escape") {
                      setOpenLink(false);
                    }
                  }}
                />
                <div
                  onClick={() => {
                    setOpenLink(false);
                  }}
                  className="cursor-pointer"
                >
                  <XIcon size={16} stroke="white" />{" "}
                </div>
              </div>
            ) : youtubeOpenLink ? (
              <div className="flex flex-col w-full items-center space-y-3">
                <div className="flex flex-row space-x-4  items-center">
                  <Input
                    className=" text-white w-64 border-0 focus-visible:ring-0"
                    onChange={(e) => {
                      setYoutubeUrl(e.target.value);
                    }}
                    placeholder="Add Link..."
                    value={youtubeUrl}
                    onKeyDown={addYoutubeVideo}
                  />
                  <Input
                    id="width"
                    type="number"
                    min="320"
                    max="1024"
                    placeholder="width"
                    value={width}
                    className="w-16 !py-0 px-0.5 text-white border-0 focus-visible:ring-0 no-scrollbar"
                    onChange={(event) => setWidth(Number(event.target.value))}
                  />
                  <Input
                    id="height"
                    type="number"
                    min="180"
                    max="720"
                    className="w-16 !py-0 px-0.5 text-white border-0 focus-visible:ring-0 no-scrollbar"
                    placeholder="height"
                    value={height}
                    onChange={(event) => setHeight(Number(event.target.value))}
                  />
                  <div
                    onClick={() => {
                      setOpenLink(false);
                    }}
                    className="cursor-pointer"
                  >
                    <XIcon size={16} stroke="white" />{" "}
                  </div>
                </div>
                <div className="flex flex-row w-full  space-x-4  items-center"></div>
              </div>
            ) : imageOpenLink ? (
              <div className="flex flex-col w-full items-center space-y-3">
                <div className="flex flex-row space-x-4 items-center">
                  <Input
                    className="text-white w-64 border-0 focus-visible:ring-0"
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Add Image URL..."
                    value={imageUrl}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        addImage();
                      }
                      if (e.key === "Escape") {
                        setImageOpenLink(false);
                      }
                    }}
                  />
                  <Input
                    id="imageWidth"
                    type="number"
                    min="100"
                    max="1024"
                    placeholder="width"
                    value={imageWidth}
                    className="w-16 !py-0 px-0.5 text-white border-0 focus-visible:ring-0 no-scrollbar"
                    onChange={(event) =>
                      setImageWidth(Number(event.target.value))
                    }
                  />
                  <Input
                    id="imageHeight"
                    type="number"
                    min="100"
                    max="720"
                    placeholder="height"
                    value={imageHeight}
                    className="w-16 !py-0 px-0.5 text-white border-0 focus-visible:ring-0 no-scrollbar"
                    onChange={(event) =>
                      setImageHeight(Number(event.target.value))
                    }
                  />
                  <div
                    onClick={() => setImageOpenLink(false)}
                    className="cursor-pointer"
                  >
                    <XIcon size={16} stroke="white" />
                  </div>
                </div>
              </div>
            ) : (
              <>
                <Button
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  className={`flex h-8 w-8 items-center justify-center hover:bg-stone-700 p-2 text-base cursor-pointer rounded-md text-white bg-stone-950 ${
                    editor.isActive("bold") ? "bg-stone-700" : ""
                  }`}
                  type="button"
                >
                  B
                </Button>
                <Button
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  className={`flex h-8 w-8 items-center justify-center hover:bg-stone-700 p-2 text-base cursor-pointer rounded-md text-white bg-stone-950 ${
                    editor.isActive("italic") ? "bg-stone-700" : ""
                  }`}
                  type="button"
                >
                  I
                </Button>
                <Button
                  onClick={() => editor.chain().focus().toggleStrike().run()}
                  className={`flex h-8 w-8 items-center justify-center hover:bg-stone-700 p-2 text-base cursor-pointer line-through rounded-md text-white bg-stone-950 ${
                    editor.isActive("strike") ? "bg-stone-700" : ""
                  }`}
                  type="button"
                >
                  S
                </Button>
                <Button
                  onClick={() => editor.chain().focus().toggleUnderline().run()}
                  className={`flex h-8 w-8 items-center justify-center hover:bg-stone-700 p-2 text-base cursor-pointer rounded-md text-white bg-stone-950 ${
                    editor.isActive("underline") ? "bg-stone-700" : ""
                  }`}
                  type="button"
                >
                  U
                </Button>
                <Button
                  onClick={() => {
                    editor.chain().focus().toggleBlockquote().run();
                  }}
                  className={`flex h-8 w-8 items-center justify-center hover:bg-stone-700 p-2 text-base cursor-pointer rounded-md text-white bg-stone-950 ${
                    editor.isActive("blockquote") ? "bg-stone-700" : ""
                  }`}
                  type="button"
                >
                  <TextQuote size={16} stroke="white" />
                </Button>
                <Button
                  onClick={() => {
                    setLinkUrl(editor.getAttributes("link").href || "");
                    setOpenLink((prev) => !prev);
                  }}
                  className={`flex h-8 w-8 items-center justify-center hover:bg-stone-700 p-2 text-base cursor-pointer rounded-md
                 text-white bg-stone-950 ${
                   editor.isActive("link") ? "bg-stone-700" : ""
                 }`}
                  type="button"
                >
                  <LinkIcon size={16} stroke="white" />
                </Button>
                <Button
                  onClick={cycleHeading}
                  className={`flex h-8 w-8 items-center justify-center hover:bg-stone-700 p-2 text-base cursor-pointer rounded-md text-white bg-stone-950 ${
                    getCurrentHeadingLevel() ? "bg-stone-700" : ""
                  }`}
                  type="button"
                >
                  {getHeadingButtonText()}
                </Button>
                <Button
                  onClick={() => {
                    if (!editor) {
                      return;
                    }
                    editor
                      .chain()
                      .focus()
                      .setTextSelection(editor.state.selection.to)
                      .setHorizontalRule()
                      .run();
                  }}
                  className={`flex h-8 w-8 items-center justify-center hover:bg-stone-700 p-2 text-base cursor-pointer rounded-md text-white bg-stone-950 `}
                  type="button"
                >
                  HR
                </Button>
                <Button
                  onClick={() => {
                    if (!editor) {
                      return;
                    }
                    editor.chain().focus().toggleCodeBlock().run();
                  }}
                  className={`flex h-8 w-8 items-center justify-center hover:bg-stone-700 p-2 text-base cursor-pointer rounded-md text-white bg-stone-950 ${
                    editor.isActive("codeBlock") ? "bg-stone-700" : ""
                  } `}
                  type="button"
                >
                  <Code size={16} stroke="white" />
                </Button>
                <Button
                  onClick={() => {
                    if (!editor) {
                      return;
                    }
                    editor.chain().focus().setTextAlign("left").run();
                  }}
                  className={`flex h-8 w-8 items-center justify-center hover:bg-stone-700 p-2 text-base cursor-pointer rounded-md text-white bg-stone-950 ${
                    editor.isActive({ textAlign: "left" }) ? "bg-stone-700" : ""
                  } `}
                  type="button"
                >
                  <AlignLeft size={16} stroke="white" />
                </Button>
                <Button
                  onClick={() => {
                    if (!editor) {
                      return;
                    }
                    editor.chain().focus().setTextAlign("center").run();
                  }}
                  className={`flex h-8 w-8 items-center justify-center hover:bg-stone-700 p-2 text-base cursor-pointer rounded-md text-white bg-stone-950 ${
                    editor.isActive({ textAlign: "center" })
                      ? "bg-stone-700"
                      : ""
                  } `}
                  type="button"
                >
                  <AlignCenter size={16} stroke="white" />
                </Button>
                <Button
                  onClick={() => {
                    if (!editor) {
                      return;
                    }
                    editor.chain().focus().setTextAlign("right").run();
                  }}
                  className={`flex h-8 w-8 items-center justify-center hover:bg-stone-700 p-2 text-base cursor-pointer rounded-md text-white bg-stone-950 ${
                    editor.isActive({ textAlign: "right" })
                      ? "bg-stone-700"
                      : ""
                  } `}
                  type="button"
                >
                  <AlignRight size={16} stroke="white" />
                </Button>
                <Button
                  onClick={() => {
                    setYoutubeOpenLink((prev) => !prev);
                  }}
                  className={`flex h-8 w-8 items-center justify-center hover:bg-stone-700 p-2 text-base cursor-pointer rounded-md
                 text-white bg-stone-950 `}
                  type="button"
                >
                  <FaYoutube size={16} stroke="white" />
                </Button>
                <Button
                  onClick={() => {
                    editor.chain().focus().toggleOrderedList().run();
                  }}
                  className={`flex h-8 w-8 items-center justify-center hover:bg-stone-700 p-2 text-base cursor-pointer rounded-md
                 text-white bg-stone-950 ${
                   editor.isActive("orderedList") ? "bg-stone-700" : ""
                 }`}
                  type="button"
                >
                  <ListOrderedIcon size={16} stroke="white" />
                </Button>
                <Button
                  onClick={() => {
                    editor.chain().focus().toggleBulletList().run();
                  }}
                  className={`flex h-8 w-8 items-center justify-center hover:bg-stone-700 p-2 text-base cursor-pointer rounded-md
                 text-white bg-stone-950 ${
                   editor.isActive("bulletList") ? "bg-stone-700" : ""
                 }`}
                  type="button"
                >
                  <ListIcon size={16} stroke="white" />
                </Button>
                <Button
                  onClick={() => {
                    if (!editor) {
                      return;
                    }
                    setImageUrl("");
                    setImageOpenLink(true);
                  }}
                  className={`flex h-8 w-8 items-center justify-center hover:bg-stone-700 p-2 text-base cursor-pointer rounded-md
                 text-white bg-stone-950`}
                  type="button"
                >
                  <ImageIcon size={16} stroke="white" />
                </Button>
              </>
            )}
          </BubbleMenu>
        )}
        {editor && (
          <FloatingMenu
             className="floating-menu flex flex-row items-center gap-1 bg-stone-950 rounded-md px-3 py-2 max-w-[340px] overflow-x-auto  no-scrollbar"
            editor={editor}
          >
            {openLink ? (
              <div className="flex flex-row space-x-4  items-center">
                <Input
                  className=" text-white w-64 border-0 focus-visible:ring-0"
                  onChange={(e) => {
                    setLinkUrl(e.target.value);
                  }}
                  placeholder="Add Link..."
                  value={linkUrl}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      if (linkUrl) {
                        editor
                          .chain()
                          .focus()
                          .extendMarkRange("link")
                          .setLink({ href: linkUrl })
                          .run();
                      } else {
                        editor.chain().focus().unsetLink().run();
                      }
                      setOpenLink(false);
                    }
                    if (e.key === "Escape") {
                      setOpenLink(false);
                    }
                  }}
                />
                <div
                  onClick={() => {
                    setOpenLink(false);
                  }}
                  className="cursor-pointer"
                >
                  <XIcon size={16} stroke="white" />{" "}
                </div>
              </div>
            ) : youtubeOpenLink ? (
              <div className="flex flex-col w-full items-center space-y-3">
                <div className="flex flex-row space-x-4  items-center">
                  <Input
                    className=" text-white w-64 border-0 focus-visible:ring-0"
                    onChange={(e) => {
                      setYoutubeUrl(e.target.value);
                    }}
                    placeholder="Add Link..."
                    value={youtubeUrl}
                    onKeyDown={addYoutubeVideo}
                  />
                  <Input
                    id="width"
                    type="number"
                    min="320"
                    max="1024"
                    placeholder="width"
                    value={width}
                    className="w-16 !py-0 px-0.5 text-white border-0 focus-visible:ring-0 no-scrollbar"
                    onChange={(event) => setWidth(Number(event.target.value))}
                  />
                  <Input
                    id="height"
                    type="number"
                    min="180"
                    max="720"
                    className="w-16 !py-0 px-0.5 text-white border-0 focus-visible:ring-0 no-scrollbar"
                    placeholder="height"
                    value={height}
                    onChange={(event) => setHeight(Number(event.target.value))}
                  />
                  <div
                    onClick={() => {
                      setOpenLink(false);
                    }}
                    className="cursor-pointer"
                  >
                    <XIcon size={16} stroke="white" />{" "}
                  </div>
                </div>
                <div className="flex flex-row w-full  space-x-4  items-center"></div>
              </div>
            ) : imageOpenLink ? (
              <div className="flex flex-col w-full items-center space-y-3">
                <div className="flex flex-row space-x-4 items-center">
                  <Input
                    className="text-white w-64 border-0 focus-visible:ring-0"
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Add Image URL..."
                    value={imageUrl}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        addImage();
                      }
                      if (e.key === "Escape") {
                        setImageOpenLink(false);
                      }
                    }}
                  />
                  <Input
                    id="imageWidth"
                    type="number"
                    min="100"
                    max="1024"
                    placeholder="width"
                    value={imageWidth}
                    className="w-16 !py-0 px-0.5 text-white border-0 focus-visible:ring-0 no-scrollbar"
                    onChange={(event) =>
                      setImageWidth(Number(event.target.value))
                    }
                  />
                  <Input
                    id="imageHeight"
                    type="number"
                    min="100"
                    max="720"
                    placeholder="height"
                    value={imageHeight}
                    className="w-16 !py-0 px-0.5 text-white border-0 focus-visible:ring-0 no-scrollbar"
                    onChange={(event) =>
                      setImageHeight(Number(event.target.value))
                    }
                  />
                  <div
                    onClick={() => setImageOpenLink(false)}
                    className="cursor-pointer"
                  >
                    <XIcon size={16} stroke="white" />
                  </div>
                </div>
              </div>
            ) : (
              <>
                <Button
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  className={`flex h-8 w-8 items-center justify-center hover:bg-stone-700 p-2 text-base cursor-pointer rounded-md text-white bg-stone-950 ${
                    editor.isActive("bold") ? "bg-stone-700" : ""
                  }`}
                  type="button"
                >
                  B
                </Button>
                <Button
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  className={`flex h-8 w-8 items-center justify-center hover:bg-stone-700 p-2 text-base cursor-pointer rounded-md text-white bg-stone-950 ${
                    editor.isActive("italic") ? "bg-stone-700" : ""
                  }`}
                  type="button"
                >
                  I
                </Button>
                <Button
                  onClick={() => editor.chain().focus().toggleStrike().run()}
                  className={`flex h-8 w-8 items-center justify-center hover:bg-stone-700 p-2 text-base cursor-pointer line-through rounded-md text-white bg-stone-950 ${
                    editor.isActive("strike") ? "bg-stone-700" : ""
                  }`}
                  type="button"
                >
                  S
                </Button>
                <Button
                  onClick={() => editor.chain().focus().toggleUnderline().run()}
                  className={`flex h-8 w-8 items-center justify-center hover:bg-stone-700 p-2 text-base cursor-pointer rounded-md text-white bg-stone-950 ${
                    editor.isActive("underline") ? "bg-stone-700" : ""
                  }`}
                  type="button"
                >
                  U
                </Button>
                <Button
                  onClick={() => {
                    editor.chain().focus().toggleBlockquote().run();
                  }}
                  className={`flex h-8 w-8 items-center justify-center hover:bg-stone-700 p-2 text-base cursor-pointer rounded-md text-white bg-stone-950 ${
                    editor.isActive("blockquote") ? "bg-stone-700" : ""
                  }`}
                  type="button"
                >
                  <TextQuote size={16} stroke="white" />
                </Button>
                <Button
                  onClick={() => {
                    setLinkUrl(editor.getAttributes("link").href || "");
                    setOpenLink((prev) => !prev);
                  }}
                  className={`flex h-8 w-8 items-center justify-center hover:bg-stone-700 p-2 text-base cursor-pointer rounded-md
                 text-white bg-stone-950 ${
                   editor.isActive("link") ? "bg-stone-700" : ""
                 }`}
                  type="button"
                >
                  <LinkIcon size={16} stroke="white" />
                </Button>
                <Button
                  onClick={cycleHeading}
                  className={`flex h-8 w-8 items-center justify-center hover:bg-stone-700 p-2 text-base cursor-pointer rounded-md text-white bg-stone-950 ${
                    getCurrentHeadingLevel() ? "bg-stone-700" : ""
                  }`}
                  type="button"
                >
                  {getHeadingButtonText()}
                </Button>
                <Button
                  onClick={() => {
                    if (!editor) {
                      return;
                    }
                    editor
                      .chain()
                      .focus()
                      .setTextSelection(editor.state.selection.to)
                      .setHorizontalRule()
                      .run();
                  }}
                  className={`flex h-8 w-8 items-center justify-center hover:bg-stone-700 p-2 text-base cursor-pointer rounded-md text-white bg-stone-950 `}
                  type="button"
                >
                  HR
                </Button>
                <Button
                  onClick={() => {
                    if (!editor) {
                      return;
                    }
                    editor.chain().focus().toggleCodeBlock().run();
                  }}
                  className={`flex h-8 w-8 items-center justify-center hover:bg-stone-700 p-2 text-base cursor-pointer rounded-md text-white bg-stone-950 ${
                    editor.isActive("codeBlock") ? "bg-stone-700" : ""
                  } `}
                  type="button"
                >
                  <Code size={16} stroke="white" />
                </Button>
                <Button
                  onClick={() => {
                    if (!editor) {
                      return;
                    }
                    editor.chain().focus().setTextAlign("left").run();
                  }}
                  className={`flex h-8 w-8 items-center justify-center hover:bg-stone-700 p-2 text-base cursor-pointer rounded-md text-white bg-stone-950 ${
                    editor.isActive({ textAlign: "left" }) ? "bg-stone-700" : ""
                  } `}
                  type="button"
                >
                  <AlignLeft size={16} stroke="white" />
                </Button>
                <Button
                  onClick={() => {
                    if (!editor) {
                      return;
                    }
                    editor.chain().focus().setTextAlign("center").run();
                  }}
                  className={`flex h-8 w-8 items-center justify-center hover:bg-stone-700 p-2 text-base cursor-pointer rounded-md text-white bg-stone-950 ${
                    editor.isActive({ textAlign: "center" })
                      ? "bg-stone-700"
                      : ""
                  } `}
                  type="button"
                >
                  <AlignCenter size={16} stroke="white" />
                </Button>
                <Button
                  onClick={() => {
                    if (!editor) {
                      return;
                    }
                    editor.chain().focus().setTextAlign("right").run();
                  }}
                  className={`flex h-8 w-8 items-center justify-center hover:bg-stone-700 p-2 text-base cursor-pointer rounded-md text-white bg-stone-950 ${
                    editor.isActive({ textAlign: "right" })
                      ? "bg-stone-700"
                      : ""
                  } `}
                  type="button"
                >
                  <AlignRight size={16} stroke="white" />
                </Button>
                <Button
                  onClick={() => {
                    setYoutubeOpenLink((prev) => !prev);
                  }}
                  className={`flex h-8 w-8 items-center justify-center hover:bg-stone-700 p-2 text-base cursor-pointer rounded-md
                 text-white bg-stone-950 `}
                  type="button"
                >
                  <FaYoutube size={16} stroke="white" />
                </Button>
                <Button
                  onClick={() => {
                    editor.chain().focus().toggleOrderedList().run();
                  }}
                  className={`flex h-8 w-8 items-center justify-center hover:bg-stone-700 p-2 text-base cursor-pointer rounded-md
                 text-white bg-stone-950 ${
                   editor.isActive("orderedList") ? "is-active" : ""
                 }`}
                  type="button"
                >
                  <ListOrderedIcon size={16} stroke="white" />
                </Button>
                <Button
                  onClick={() => {
                    editor.chain().focus().toggleBulletList().run();
                  }}
                  className={`flex h-8 w-8 items-center justify-center hover:bg-stone-700 p-2 text-base cursor-pointer rounded-md
                 text-white bg-stone-950 ${
                   editor.isActive("bulletList") ? "bg-stone-700" : ""
                 }`}
                  type="button"
                >
                  <ListIcon size={16} stroke="white" />
                </Button>
                <Button
                  onClick={() => {
                    setImageUrl("");
                    setImageOpenLink(true);
                  }}
                  className={`flex h-8 w-8 items-center justify-center hover:bg-stone-700 p-2 text-base cursor-pointer rounded-md text-white bg-stone-950 ${
                    editor.isActive("image") ? "bg-stone-700" : ""
                  }`}
                  type="button"
                >
                  <ImageIcon size={16} stroke="white" />
                </Button>
              </>
            )}
          </FloatingMenu>
        )}
      </div>
    </main>
  );
};

export default Write;
