import * as cliUi from 'cliui'

export default function UI(opts?: {
  width?: number;
  wrap?: boolean;
}) {
  return cliUi(opts)
};