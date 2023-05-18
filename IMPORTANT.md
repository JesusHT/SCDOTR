# MODIFICAR LIBRERIA DE ULTRALYTICS

/yolo/engine/results.py

    def verbose(self):
        """
        Return log string for each task.
        """
        log_string = ''
        probs = self.probs
        boxes = self.boxes
        if len(self) == 0:
            return log_string if probs is not None else f'{log_string}(no detections), '
        if probs is not None:
            n5 = min(len(self.names), 5)
            top5i = probs.argsort(0, descending=True)[:n5].tolist()  # top 5 indices
            log_string += f"{', '.join(f'{self.names[j]} {probs[j]:.2f}' for j in top5i)}, "
        if boxes:
            products = []

            # Abrimos el archivo JSON y leemos su contenido
            try:
                with open("/home/jesusht/Descargas/ejemplo/productos.json", "r") as archivo_json:
                    products = json.load(archivo_json)
            except FileNotFoundError:
                    products = []
            
            for c in boxes.cls.unique():
                n = (boxes.cls == c).sum()  # detections per class
                log_string += f"{n} {self.names[int(c)]}{'s' * (n > 1)}, "

                # objetos detectados self.names[int(c)]
                new_product = {"names": self.names[int(c)]}

                # Verificamos si el valor ya existe en el archivo JSON antes de agregarlo
                if new_product not in products:
                    products.append(new_product)

            # Escribimos los datos de los productos actualizados en el archivo JSON
            with open("/home/jesusht/Descargas/ejemplo/productos.json", "w") as archivo_json:
                json.dump(products, archivo_json)
        return log_string