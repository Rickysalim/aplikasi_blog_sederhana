import Page from "../../components/Page";
import CreateArticleForm from "../../sections/create_post/CreateArticleForm";

export default function CreatePost() {
    return (
        <>
            <Page title={"Create Post"}>
                <CreateArticleForm />
            </Page>
        </>
    )
}