import type { ActionArgs } from "@remix-run/node";

export default function Request() {
  return <div>Test</div>;
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();

  console.log(Object.fromEntries(formData));

  return null;
}
