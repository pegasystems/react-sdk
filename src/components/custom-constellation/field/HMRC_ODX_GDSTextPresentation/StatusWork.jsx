import { Status } from "@pega/cosmos-react-core";

export default function StatusWorkRenderer({ value }) {
  let variant = "info";

  const warnStrings = ["fail", "cancel", "reject", "revoke", "stopped", "warn"];
  const infoStrings = ["open", "hold", "info", "new"];
  const successStrings = ["resolved", "completed", "success"];
  const pendingStrings = ["pending"];

  if (new RegExp(warnStrings.join("|"), "i").test(value)) {
    variant = "warn";
  } else if (new RegExp(infoStrings.join("|"), "i").test(value)) {
    variant = "info";
  } else if (new RegExp(successStrings.join("|"), "i").test(value)) {
    variant = "success";
  } else if (new RegExp(pendingStrings.join("|"), "i").test(value)) {
    variant = "pending";
  }

  return (
    <Status type="rectangle" variant={variant}>
      {value}
    </Status>
  );
}
