# 🧠 Breast Cancer Detection Using CNN and SVM

This project focuses on the automated detection of **Invasive Ductal Carcinoma (IDC)** — the most common subtype of breast cancer — using deep learning and machine learning techniques. The dataset contains over **277,000** labeled histopathology image patches (**50x50 pixels** each), derived from high-resolution whole-slide scans of breast cancer specimens. Each patch is classified as either **IDC positive (malignant)** or **IDC negative (benign)**.

---

## 📦 Dataset Description

- **Source:** Breast Histopathology Images Dataset (IDC)
- **Total Images:** 277,524
- **Image Size:** 50 x 50 pixels

### 📁 Classes

- `class0`: Non-IDC (Benign)
- `class1`: IDC (Malignant)

### 🧾 File Format

Example: `10253_idx5_x1351_y1101_class0.png`

- `10253_idx5`: Patient ID
- `x1351`, `y1101`: Patch coordinates
- `class0`: Class label (IDC negative)

---

## ⚙️ Methodology

### 🔄 Preprocessing

- Images are loaded from multiple patient folders (e.g., 10253, 10254, etc.)
- Labels are extracted from filenames (`class0` or `class1`)
- Images are normalized to pixel range [0, 1]

### 🧠 CNN for Feature Extraction

- A lightweight **Convolutional Neural Network (CNN)** is trained on image patches
- CNN is used to extract deep features from intermediate layers for further classification

### 🎯 SVM for Final Classification

- Features extracted from the CNN are flattened and standardized
- A **Support Vector Machine (SVM)** classifier is trained on these features
- Final prediction is made based on the SVM output

### 📈 Evaluation

- **Accuracy**, **confusion matrix**, and **classification reports** are computed
- Training performance is visualized using `matplotlib`

---

## 📊 Objective

To explore **hybrid deep learning and traditional machine learning approaches** for medical image classification, aiming to improve **diagnostic reliability** and **interpretability** in automated breast cancer detection systemss.
