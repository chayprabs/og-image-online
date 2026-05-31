import DocumentTitle from "../components/DocumentTitle";
import Playground from "../components/Playground";

export default function HomePage() {
  return (
    <>
      <DocumentTitle
        title="SocialRender — OG Images & Code Screenshots"
        description="Generate Open Graph social cards and syntax-highlighted code screenshots online."
      />
      <Playground />
    </>
  );
}
