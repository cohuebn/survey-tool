type PageProps = {
  params: { surveyId: string };
};

export default function Page({ params }: PageProps) {
  const { surveyId } = params;
  return <div>Survey results for survey {surveyId}</div>;
}
