import FlakeId from "flake-idgen";

const flake = new FlakeId();

export function generateFlakeId() {
  const idBuffer = flake.next();
  const id = BigInt("0x" + idBuffer.toString("hex")).toString();
  return id;
}
