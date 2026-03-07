import { useEffect } from "react";

interface MetaOptions {
  title: string;
  description?: string;
  ogImage?: string;
  url?: string;
}

function setMeta(property: string, content: string) {
  let el = document.querySelector(`meta[property="${property}"]`);
  if (!el) {
    el = document.querySelector(`meta[name="${property}"]`);
  }
  if (el) {
    el.setAttribute("content", content);
  }
}

export function useMeta({ title, description, ogImage, url }: MetaOptions) {
  useEffect(() => {
    const fullTitle = title === "datsfilipe" ? title : `${title} — datsfilipe`;
    document.title = fullTitle;

    setMeta("og:title", title);
    setMeta("twitter:title", title);

    if (description) {
      setMeta("description", description);
      setMeta("og:description", description);
      setMeta("twitter:description", description);
    }

    if (ogImage) {
      const src = ogImage.startsWith("http")
        ? ogImage
        : `https://datsfilipe.xyz${ogImage}`;
      setMeta("og:image", src);
      setMeta("twitter:image", src);
    }

    if (url) {
      setMeta("og:url", `https://datsfilipe.xyz${url}`);
    }

    return () => {
      document.title = "datsfilipe";
    };
  }, [title, description, ogImage, url]);
}
