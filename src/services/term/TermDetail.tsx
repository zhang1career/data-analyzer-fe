import React from "react";
import {Term} from "../../models/Term.ts";

interface TermDetailProps {
  item: Term;
  children?: React.ReactNode;
}

const TermDetail: React.FC<TermDetailProps> = ({
                                                 item,
                                                 children = undefined
                                               }) => {
  return (
    <div>
      <h3>{item.name}</h3>
      <p>id: {item.id}</p>
      <p>content: {item.content}</p>
      {children}
    </div>
  );
}

export default TermDetail;