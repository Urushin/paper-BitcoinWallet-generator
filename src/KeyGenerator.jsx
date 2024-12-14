import React, { useState } from "react";
import * as bitcoin from "bitcoinjs-lib";
import { Buffer } from "buffer";
import { jsPDF } from "jspdf";
import QRCode from "qrcode";
import { FiCopy } from "react-icons/fi";
window.Buffer = Buffer;

const KeyGenerator = () => {
  const [publicAddress, setPublicAddress] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [privateQrCode, setPrivateQrCode] = useState("");
  const [copied, setCopied] = useState("");

  const generateKeys = async () => {
    try {
      const keyPair = bitcoin.ECPair.makeRandom();
      const privateKeyWIF = keyPair.toWIF();
      const { address } = bitcoin.payments.p2pkh({
        pubkey: keyPair.publicKey,
      });

      setPublicAddress(address);
      setPrivateKey(privateKeyWIF);

      const qrCodeData = await QRCode.toDataURL(address);
      setQrCode(qrCodeData);

      const privateQrCodeData = await QRCode.toDataURL(privateKeyWIF);
      setPrivateQrCode(privateQrCodeData);
    } catch (error) {
      console.error("Erreur lors de la génération des clés : ", error);
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("Paper Wallet Bitcoin", 20, 20);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Note : Ne partagez jamais votre clé privée.", 20, 30);
    doc.text("Conservez ce fichier en lieu sûr.", 20, 40);

    doc.setFontSize(16);
    doc.setFont("courier", "bold");
    doc.text(`Adresse Publique :`, 20, 60);
    doc.text(publicAddress, 20, 70);

    doc.text(`Clé Privée :`, 20, 90);
    doc.text(privateKey, 20, 100);

    doc.save("paper-wallet.pdf");
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(""), 2000);
  };

  return (
    <div className="container">
      <h1 className="title">Générateur de Paper Wallet 🪙</h1>
      <p className="subtitle">
        Créez une adresse Bitcoin et sa clé privée. Sauvegardez vos informations avec précaution.
      </p>
  
      <p className="warning">
        ⚠️ <strong>Avertissement :</strong> Ne partagez jamais votre clé privée.
      </p>
  
      <div className="button-group">
        <button className="button" onClick={generateKeys}>
          Générer une Adresse 🚀
        </button>
        <button
          className="button"
          onClick={() => {
            setPublicAddress("");
            setPrivateKey("");
            setQrCode("");
            setPrivateQrCode("");
            setCopied("");
          }}
        >
          Réinitialiser 🔒
        </button>
      </div>
  
      {publicAddress && (
        <div className="result">
          <div className="result-box">
            <h3>Adresse Publique</h3>
            <div className="copy-container">
              <p>{publicAddress}</p>
              <button
                className="icon-button"
                onClick={() => copyToClipboard(publicAddress, "Adresse Publique")}
              >
                <FiCopy />
              </button>
            </div>
          </div>
          <div className="result-box">
            <h3>Clé Privée</h3>
            <div className="copy-container">
              <p>{privateKey}</p>
              <button
                className="icon-button"
                onClick={() => copyToClipboard(privateKey, "Clé Privée")}
              >
                <FiCopy />
              </button>
            </div>
          </div>
          <div className="result-box qr-box">
            <h3>QR Code de l'Adresse</h3>
            <img src={qrCode} alt="QR Code Adresse Publique" />
          </div>
          <div className="result-box qr-box">
            <h3>QR Code de la Clé Privée</h3>
            <img src={privateQrCode} alt="QR Code Clé Privée" />
          </div>
          <button className="button" onClick={downloadPDF}>
            Télécharger en PDF 🖨️
          </button>
        </div>
      )}
  
      {copied && <p className="copied-message">✅ {copied} copiée avec succès !</p>}
  
      {/* Texte de crédit */}
      <footer className="credit">
        <p>
          Réalisé par <a href="https://github.com/Urushin" target="_blank" rel="noopener noreferrer">@urushin</a>
        </p>
      </footer>
    </div>
  );
  
};

export default KeyGenerator;
