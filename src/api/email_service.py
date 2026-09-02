import os
import resend

resend.api_key = os.getenv("RESEND_API_KEY")

# Dominio de pruebas de Resend. Solo permite enviar al correo con el que te
# registraste en Resend. Cuando verifiques un dominio propio, cambia esto
# por algo tipo "no-reply@tudominio.com".
FROM_EMAIL = "onboarding@resend.dev"

# URL base de tu frontend. La usamos para armar los links que van dentro
# de los correos (verificación, y más adelante recuperar contraseña).
FRONTEND_URL = "https://psychic-telegram-4jvrq57vwwv73q7g4-3000.app.github.dev"


def send_email(to_email: str, subject: str, html_content: str) -> bool:
    """
    Función genérica de envío. Todo correo del sistema (verificación,
    recuperar contraseña, confirmación de pedido, etc.) pasa por aquí,
    para tener un solo punto de conexión con Resend.

    Devuelve True si Resend aceptó el envío, False si algo falló.
    No lanza excepción hacia arriba a propósito: un correo que falla
    no debe tumbar el flujo principal (ej. el registro del usuario).
    """
    try:
        resend.Emails.send({
            "from": FROM_EMAIL,
            "to": to_email,
            "subject": subject,
            "html": html_content,
        })
        return True
    except Exception as e:
        # En producción esto debería ir a un logger real, no a print.
        # Por ahora nos sirve para ver el error en la consola del servidor.
        print(f"[email_service] Error enviando correo a {to_email}: {e}")
        return False


def build_verification_email_html(user_name: str, token: str) -> str:
    """
    Arma el HTML del correo de verificación. Separado de send_email()
    para que el contenido se pueda editar sin tocar la lógica de envío.
    """
    verify_link = f"{FRONTEND_URL}/verificar-email/{token}"

    return f"""
    <div style="font-family: Georgia, serif; max-width: 480px; margin: 0 auto; color: #1a1a1a;">
        <h2 style="color: #1a1a1a;">Hola {user_name},</h2>
        <p style="font-size: 16px; line-height: 1.5;">
            Gracias por registrarte en In Vino Veritas. Confirma tu correo
            para poder comprar con tu cuenta:
        </p>
        <p style="text-align: center; margin: 32px 0;">
            <a href="{verify_link}"
               style="background-color: #C9A84C; color: #1a1a1a; padding: 14px 28px;
                      text-decoration: none; border-radius: 4px; font-weight: bold;
                      display: inline-block;">
                Verificar mi correo
            </a>
        </p>
        <p style="font-size: 14px; color: #555;">
            Este link es válido por 24 horas. Si no fuiste tú quien se registró,
            puedes ignorar este correo.
        </p>
    </div>
    """


def send_verification_email(user, token: str) -> bool:
    """
    Función de conveniencia que junta las dos anteriores para el caso
    específico de verificación de email. Esta es la que llamas desde auth.py.
    """
    html = build_verification_email_html(user.name, token)
    return send_email(
        to_email=user.email,
        subject="Verifica tu correo — In Vino Veritas",
        html_content=html,
    )