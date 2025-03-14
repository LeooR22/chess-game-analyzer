import {Suspense} from "react";

import ChessHistory from "../../../../chess-history";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChessHistory />
    </Suspense>
  );
}
