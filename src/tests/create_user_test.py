from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import random
import traceback
import os

# 📁 Ruta absoluta a la imagen de perfil
image_path = os.path.abspath("images.jpg")

# Configurar el navegador
options = webdriver.ChromeOptions()

driver = webdriver.Chrome(options=options)

try:
    wait = WebDriverWait(driver, 15)

    # 1️⃣ Ir al login
    driver.get("http://localhost:4200/login")
    wait.until(EC.presence_of_element_located((By.ID, "email")))
    print("🟢 Página de login cargada")

    # 2️⃣ Llenar email y contraseña
    driver.find_element(By.ID, "email").send_keys("angel.castilla@vallegrande.edu.pe")
    driver.find_element(By.ID, "password").send_keys("936609401")

    # Esperar que el botón esté clickeable y que no haya loader
    login_button = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, 'button[type="submit"]')))
    wait.until(EC.invisibility_of_element_located((By.CSS_SELECTOR, ".animate-spin")))
    driver.execute_script("arguments[0].scrollIntoView(true);", login_button)
    time.sleep(0.1)
    login_button.click()
    print("🟢 Se hizo clic en Iniciar sesión")

    # 3️⃣ Esperar redirección al dashboard
    wait.until(EC.url_contains("/dashboard"))
    print("🟢 Redirigido al dashboard")

    # 4️⃣ Ir al módulo de usuarios
    driver.get("http://localhost:4200/usuarios")
    wait.until(EC.presence_of_element_located((By.XPATH, "//button[contains(., 'Nuevo Usuario')]")))
    print("🟢 Página de usuarios cargada")

    # 5️⃣ Clic en "Nuevo Usuario"
    nuevo_btn = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(., 'Nuevo Usuario')]")))
    nuevo_btn.click()
    print("🟢 Modal de nuevo usuario abierto")

    # 6️⃣ Esperar formulario
    wait.until(EC.visibility_of_element_located((By.ID, "name")))

    # 6.1️⃣ Subir imagen de perfil
    image_input = driver.find_element(By.ID, "profileImage")
    image_input.send_keys(image_path)
    print("🟢 Imagen de perfil cargada")

    # 7️⃣ Llenar el formulario
    random_number = str(random.randint(10000, 99999))
    email_test = f"selenium{random_number}@test.com"

    driver.find_element(By.ID, "name").send_keys("Selenium")
    driver.find_element(By.ID, "lastName").send_keys("Tester")
    driver.find_element(By.ID, "documentType").click()
    driver.find_element(By.XPATH, "//option[@value='DNI']").click()
    driver.find_element(By.ID, "documentNumber").send_keys("95426385")
    driver.find_element(By.ID, "cellPhone").send_keys("987654321")
    driver.find_element(By.ID, "email").send_keys(email_test)
    driver.find_element(By.ID, "password").send_keys("test1234")
    driver.find_element(By.ID, "role").click()
    driver.find_element(By.XPATH, "//option[@value='USER']").click()
    time.sleep(1)

    # 8️⃣ Click en "Guardar"
    guardar_btn = wait.until(EC.presence_of_element_located((By.XPATH, "//button[contains(., 'Guardar')]")))
    driver.execute_script("arguments[0].scrollIntoView(true);", guardar_btn)
    time.sleep(0.3)
    guardar_btn.click()
    print("🟢 Usuario enviado para creación")

    # 9️⃣ Redirección al dashboard
    wait.until(EC.url_contains("/dashboard"))
    print("🟢 Redirigido nuevamente al dashboard")

    # 🔟 Verificar si el usuario aparece
    driver.get("http://localhost:4200/usuarios")
    wait.until(EC.presence_of_element_located((By.TAG_NAME, "table")))
    time.sleep(2)

    assert email_test in driver.page_source
    print(f"✅ Usuario creado con éxito y aparece en la tabla: {email_test}")

except Exception as e:
    print("❌ Error en la prueba:", e)
    traceback.print_exc()

finally:
    driver.quit()
