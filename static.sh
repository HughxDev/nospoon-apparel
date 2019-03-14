#!/bin/bash
rm -rf local.apparel.nospoon.tv/
rm -rf dist/

wget -r http://local.apparel.nospoon.tv \
  --domains local.apparel.nospoon.tv \
  --exclude-domains js.stripe.com,checkout.stripe.com,www.youtube.com,storage.googleapis.com,printaura.com

mv local.apparel.nospoon.tv dist