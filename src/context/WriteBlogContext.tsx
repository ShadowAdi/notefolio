import {
  createContext,
  Dispatch,
  ReactNode,
  useContext,
  useState,
} from "react";

export const WriteBlogContext = createContext<{
  blogTitle: string;
  setBlogTitle: Dispatch<React.SetStateAction<string>>;
  blogDescription: string;
  setBlogDescription: Dispatch<React.SetStateAction<string>>;
  blogCover: string;
  setBlogCover: Dispatch<React.SetStateAction<string>>;
    blogTags: [string]|[];
  setBlogTags: Dispatch<React.SetStateAction<[string]|[]>>;
}>({
  blogTitle: "",
  setBlogTitle: () => {},
  blogDescription: "",
  setBlogDescription: () => {},
  blogCover: "",
  setBlogCover: () => {},
  blogTags:[],
  setBlogTags:()=>{}
});

export const WriteContextProvider = ({ children }: { children: ReactNode }) => {
  const [blogTitle, setBlogTitle] = useState("");
  const [blogDescription, setBlogDescription] = useState("");
  const [blogCover, setBlogCover] = useState("");
  const [blogTags, setBlogTags] = useState<[string]|[]>([])

  return (
    <WriteBlogContext.Provider
      value={{
        blogDescription,
        blogTitle,
        setBlogDescription,
        setBlogTitle,
        blogCover,
        setBlogCover,
        blogTags,
        setBlogTags
      }}
    >
      {children}
    </WriteBlogContext.Provider>
  );
};
export const useBlog = () => useContext(WriteBlogContext);
