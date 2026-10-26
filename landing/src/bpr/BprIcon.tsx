import { CalculatorIcon, FingerprintIcon, FlaskIcon, KeyIcon, LayersIcon, LinkIcon, ServerIcon, UsersIcon } from "../Icons";
import type { BprIcon as IconName } from "./modules";

const MAP = {
  key: KeyIcon,
  link: LinkIcon,
  fingerprint: FingerprintIcon,
  users: UsersIcon,
  flask: FlaskIcon,
  calculator: CalculatorIcon,
  server: ServerIcon,
  layers: LayersIcon
};

export function BprIcon({ name, size = 18 }: { name: IconName; size?: number }) {
  const Icon = MAP[name];
  return <Icon size={size} />;
}
