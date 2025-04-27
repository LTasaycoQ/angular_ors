from selenium import webdriver
from selenium.webdriver.common.by import By
import time

driver = webdriver.Chrome()

try:
    # 🔐 Cambia esta URL si estás usando algo diferente a localhost
    driver.get("http://localhost:4200/login")
    time.sleep(2)

    # 📨 Ingresar email
    email_input = driver.find_element(By.ID, "email")
    email_input.send_keys("angel.castilla@vallegrande.edu.pe")

    # 🔒 Ingresar contraseña
    password_input = driver.find_element(By.ID, "password")
    password_input.send_keys("936609401")

    # 🚀 Click en el botón de login
    login_button = driver.find_element(By.CSS_SELECTOR, 'button[type="submit"]')
    login_button.click()

    time.sleep(10)  # espera a que cargue

    # ✅ Validar que cambió la ruta
    assert "dashboard" in driver.current_url or "home" in driver.current_url
    print("✅ Login exitoso")

except Exception as e:
    print("❌ Falló la prueba:", e)

finally:
    driver.quit()
