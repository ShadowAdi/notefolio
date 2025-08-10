"use client";
import React, { useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { BubbleMenu } from "@tiptap/react/menus";
import { Button } from "@/components/ui/button";
import Blockquote from "@tiptap/extension-blockquote";
import { Code, LinkIcon, TextQuote, XIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "@tiptap/extension-link";
import Heading from "@tiptap/extension-heading";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { all, createLowlight } from "lowlight";
import 'highlight.js/styles/github-dark.css'; 

const Write = () => {
  const [blogTitle, setBlogTitle] = useState("");
  const [blogDescription, setBlogDescription] = useState("");
  const [openLink, setOpenLink] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const lowlight = createLowlight(all);

  const editor = useEditor({
    content: blogDescription,
    extensions: [
      StarterKit.configure({ horizontalRule: false }),
      Blockquote.configure({
        HTMLAttributes: {
          class: "border-l-4 border-gray-300 pl-4 italic", // Optional: Style the blockquote
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
        .toggleHeading({ level: currentLevel + 1 })
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
    <main className="flex flex-col gap-4 items-center">
      <div className="flex flex-col items-center max-w-2xl w-full">
        <input
          onChange={(e) => setBlogTitle(e.currentTarget.value)}
          value={blogTitle}
          type="text"
          placeholder="Add A Title..."
          className="py-5 w-full outline-0 ring-0 focus-visible:ring-0 placeholder:text-neutral-400 text-black text-2xl"
        />
        <div className="w-full h-full relative">
          <EditorContent
            placeholder="Start Writing..."
            className="list-disc list-inside w-full h-full overflow-y-auto ProseMirror scrollbar-transparent_tiptap"
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
            `,
            }}
          />
        </div>
        {editor && (
          <BubbleMenu
            editor={editor}
            className="bubble-menu flex flex-row items-center gap-1 justify-center bg-stone-950 rounded-md px-3 py-2"
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
              </>
            )}
          </BubbleMenu>
        )}
      </div>
    </main>
  );
};

export default Write;
