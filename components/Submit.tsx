"use client";

import { Button } from "@nextui-org/react";
import { useFormStatus } from "react-dom";

const Submit = ({ label, ...btnProps }: { label: any }) => {
  const { pending } = useFormStatus();

  return (
    <Button
      {...btnProps}
      color="primary"
      isLoading={pending}
      type="submit"
      variant="shadow"
    >
      {label}
    </Button>
  );
};

export default Submit;
