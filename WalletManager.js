// =========================================
// WalletManager.js - CONEXIÓN WEB3 AMIGABLE
// =========================================

window.WalletManager = {
    inyectarModal: function() {
        // Creamos la ventana emergente amigable para F2P con medidas responsivas
        const modalHTML = `
            <div id="wallet-modal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:9999; justify-content:center; align-items:center;">
                <div style="background:#1a1a2e; border: 2px solid #00d2ff; border-radius: 10px; padding: 20px; width: 85%; max-width: 320px; box-sizing: border-box; text-align: center; color: white; font-family: sans-serif; box-shadow: 0 4px 15px rgba(0,0,0,0.5);">
                    <h2 style="color: #00d2ff; margin-top:0; font-size: 18px;">Mercado Global Web3</h2>
                    <p style="font-size: 13px; line-height: 1.4; margin-bottom: 15px;">
                        Tus POL están a salvo en la Red Nexo. Para comprar, vender y exportar Genos con otros jugadores, necesitas vincular tu billetera Web3.
                    </p>
                    <p style="font-size: 11px; color: #aaa; margin-bottom: 20px;">
                        ¿Aún no tienes una? ¡No hay problema! Sigue jugando gratis, acumula POL y vincúlala cuando estés listo.
                    </p>
                    <button id="btn-conectar-metamask" style="background: #f6851b; color: white; border: none; padding: 10px; font-weight: bold; border-radius: 5px; cursor: pointer; width: 100%; margin-bottom: 10px; font-size: 14px;">
                        🦊 CONECTAR METAMASK
                    </button>
                    <button onclick="document.getElementById('wallet-modal').style.display='none'" style="background: transparent; color: #888; border: 1px solid #888; padding: 8px; border-radius: 5px; cursor: pointer; width: 100%; font-size: 13px;">
                        Quizás más tarde
                    </button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        document.getElementById("btn-conectar-metamask").onclick = async () => {
            if (typeof window.ethereum !== 'undefined') {
                try {
                    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                    const address = accounts[0];
                    
                    if(!window.miWallet) window.miWallet = { pol: 10.0 };
                    window.miWallet.address = address;
                    
                    document.getElementById('wallet-modal').style.display='none';
                    window.WalletManager.actualizarBoton();
                    
                    if(typeof window.guardarProgreso === 'function') window.guardarProgreso();
                    
                    alert("¡Billetera vinculada exitosamente!");
                } catch (error) {
                    alert("Conexión cancelada.");
                }
            } else {
                alert("No se detectó MetaMask. Por favor, instala la extensión en tu navegador.");
            }
        };
    },

    actualizarBoton: function() {
        const polText = document.getElementById("pol-amount");
        if (!polText) return;

        polText.style.cursor = "pointer";
        polText.style.transition = "0.2s";
        polText.onmouseover = () => polText.style.filter = "brightness(1.5)";
        polText.onmouseout = () => polText.style.filter = "brightness(1)";

        const saldo = window.miWallet && window.miWallet.pol !== undefined ? window.miWallet.pol.toFixed(1) : "0.0";

        if (window.miWallet && window.miWallet.address) {
            const address = window.miWallet.address;
            const shortAddress = address.substring(0, 4) + "..." + address.substring(address.length - 4);
            polText.innerText = `${saldo} POL | ✅ ${shortAddress}`;
            
            polText.onclick = () => {
                if(confirm("Tu billetera actual es " + address + ".\n¿Deseas desvincularla?")) {
                    window.miWallet.address = null;
                    this.actualizarBoton();
                    if(typeof window.guardarProgreso === 'function') window.guardarProgreso();
                }
            };
        } else {
            polText.innerText = `${saldo} POL | 🦊 Vincular`;
            polText.onclick = () => {
                document.getElementById('wallet-modal').style.display = 'flex';
            };
        }
    }
};

document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        window.WalletManager.inyectarModal();
        window.WalletManager.actualizarBoton();
    }, 500); 
});