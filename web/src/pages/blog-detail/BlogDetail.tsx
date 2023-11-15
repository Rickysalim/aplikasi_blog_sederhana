import Page from "../../components/Page";
import { useSelector } from "../../redux/store";
import BlogDetailSection from "../../sections/landing/blog-detail/BlogDetailSection";

export default function Blog() {
    const { postByTitle } = useSelector((state) => state.blog)
    return (
        <>
            <Page title={postByTitle?.data?.title}>
                <BlogDetailSection />
            </Page>
        </>
    )
}