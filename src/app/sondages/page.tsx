import type { Metadata } from "next";
import SondagesPresidentielle from "../../../components/SondagesPresidentielle";

export const metadata: Metadata = {
  title: "Présidentielle 2027 · Sondages",
  description: "Suivi des intentions de vote pour l'élection présidentielle de 2027",
};

export default function SondagesPage() {
  return <SondagesPresidentielle />;
}
