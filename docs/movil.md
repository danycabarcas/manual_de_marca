# Móvil (Android / Flutter / iOS)

Archivos de colores listos para pegar en el proyecto.

## Android (res/values/colors.xml)

```bash
cp dist/tokens/android-colors.xml app/src/main/res/values/magdalena_colors.xml
```

## Flutter

```dart
// copie dist/tokens/flutter_magdalena_colors.dart a lib/theme/
import 'theme/flutter_magdalena_colors.dart';
ThemeData(colorScheme: ColorScheme.fromSeed(seedColor: MagdalenaColors.primary), fontFamily: 'Montserrat');
```

## iOS / otros

```bash
# use dist/tokens/magdalena-tokens.json (hex, rgb, cmyk) para generar su asset catalog
```
