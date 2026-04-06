
export const extractJSON = (text) => {
  const match = text.match(/\{[\s\S]*\}/)
  if (!match) throw new Error("No JSON found")
  return match[0]
}