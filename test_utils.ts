export async function streamToString(
  stream: ReadableStream<string>,
): Promise<string> {
  const reader = stream.getReader();
  let result = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    result += value;
  }
  return result;
}
