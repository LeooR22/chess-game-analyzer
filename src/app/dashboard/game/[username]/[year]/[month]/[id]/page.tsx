import {PageClient} from "./page-client";

export default async function Page({
  params,
}: {
  params: Promise<{username: string; year: string; month: string; id: string}>;
}) {
  const {username, year, month, id} = await params;

  return (
    <PageClient
      params={{
        username: username,
        year: year,
        month: month,
        id: id,
      }}
    />
  );
}
