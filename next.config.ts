import type { NextConfig } from "next";

const nextConfig: NextConfig = {
images:{
  remotePatterns:[
    {
      hostname:"randomuser.me"
    },
    {
      hostname:"deifkwefumgah.cloudfront.net"
    }
  ]
}
};

export default nextConfig;
