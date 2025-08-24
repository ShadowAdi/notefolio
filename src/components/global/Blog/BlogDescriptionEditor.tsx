'use client'
import HorizontalRule from "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension";
import Heading from "@tiptap/extension-heading";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Youtube from "@tiptap/extension-youtube";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Blockquote from "@tiptap/extension-blockquote";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { all, createLowlight } from "lowlight";
import "highlight.js/styles/github-dark.css";
import React from "react";
import TextAlign from "@tiptap/extension-text-align";
import { BulletList, ListItem, OrderedList } from "@tiptap/extension-list";

const BlogDescriptionEditor = ({
  blogDescription,
}: {
  blogDescription: string;
}) => {
  const lowlight = createLowlight(all);

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
          class: "object-cover my-2",
        },
      }),
    ],
    editable: false,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "w-full h-full overflow-y-auto mb-8 outline-none text-md font-normal caret-black flex-1 h-[60vh]",
      },
    },
  });
  return (
    <EditorContent
      className="list-disc list-inside flex-1 min-h-[400px] w-full h-full overflow-y-auto ProseMirror scrollbar-transparent_tiptap placeholder:text-black"
      style={{
        whiteSpace: "pre-line",
        overflowY: "auto",
      }}
      readOnly
      editor={editor}
    />
  );
};

export default BlogDescriptionEditor;
