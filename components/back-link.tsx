import { Glass } from "./prism/glass";
import { Glyph } from "./prism/glyph";

/** iOS-style back capsule at the top of every subpage. */
export function BackLink({ label = "Back" }: { label?: string }) {
  return (
    <Glass variant="thin" href="/" className="pg-back pg-launch" ariaLabel={label === "Back" ? "Back to home" : label}>
      <Glyph name="back" />
      {label}
    </Glass>
  );
}
