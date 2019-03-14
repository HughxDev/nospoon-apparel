#!/bin/bash
rm -rf local.ja.apparel.nospoon.tv/
rm -rf ja/

wget -r http://local.ja.apparel.nospoon.tv \
  --domains local.ja.apparel.nospoon.tv \
  --exclude-domains js.stripe.com,checkout.stripe.com,www.youtube.com,storage.googleapis.com,printaura.com

mv local.ja.apparel.nospoon.tv ja