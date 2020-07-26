#!/bin/bash

# This script checks for updated nightly releases in Github and pulls the binaries if found.

json=`curl -sSH "Accept: application/vnd.github.v3+json" https://api.github.com/repos/MikePopoloski/slang/releases`
curr_date=`echo "$json" | jq -r ".[] | select(.name == \"Nightly\") | .published_at"`

# If the saved date matches the published nightly, we're done.
if [[ -f ~/lastupdate.txt ]] && [[ $(<~/lastupdate.txt) == $curr_date ]]; then
  exit 0
fi

# Otherwise, download the nightly image, unzip, copy to the right directory.
url=`echo $json | jq -r ".[] | select(.name == \"Nightly\") | .assets[] | select(.name == \"slang-linux.tar.gz\") | .browser_download_url"`
curl -sSL -o ~/slang-linux.tar.gz $url
rm -rf /tmp/slangbin/
mkdir -p /tmp/slangbin/
tar -xf ~/slang-linux.tar.gz -C /tmp/slangbin/
cp /tmp/slangbin/slang/bin/slang ~/slang-website/

# Save date of last update.
echo "$curr_date" > ~/lastupdate.txt
echo "Updated to $curr_date"