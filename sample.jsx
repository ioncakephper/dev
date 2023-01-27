
const Features = ({title, subTitle, children}) => {

    return <Section>
        <SectionTitle>{title}</SectionTitle>
        <SectionSubtitle>{subTitle}</SectionSubtitle>
        {children}
    </Section>
}

const ImageAndText = () => {
    return <Row>
        <Column></Column>
        <Column>{children}</Column>
    </Row>
}

const TitledFragment = ({title, additionalTarget, children}) => {
    return <><h2 className="fragment--title">{title}</h2>
    <div className="fragment--body">
        {children}
        <Link to={additionalTarget}>See more...</Link>
    </div>
    </>
}

<Features title="Create standard features" subTitle="Bring several new applications allows you to generate standard features. You can call it anytime, and bring standard features quickly.">
    <ImageAndText imageLeft>
        <TitledFragment title="Fragment title goes here..." additionalTarget="">The text goes here...</TitledFragment>
    </ImageAndText>
</Features>