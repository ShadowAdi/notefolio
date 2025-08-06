import { PenSquare, Eye, Mail, Users, Sparkles } from "lucide-react";
import React from "react";

const Features = () => {
  return (
    <section className="py-24 px-6">
      <div className="container">
        <div className="grid gap-8 grid-cols-1 xl:grid-cols-2">
          {/* Heading */}
          <h2 className="row-span-2 text-3xl font-semibold lg:text-5xl">
            Our Values and Principles
          </h2>
          <div className="grid grid-cols-1 grid-rows-1 space-y-4 space-x-6 lg:grid-cols-2 lg:grid-rows-2">
            <div className="flex flex-col space-y-2">
              <h3 className="mb-2 text-xl font-medium flex items-center gap-2">
                <PenSquare className="size-5 text-primary" /> Rich Text Blogging
              </h3>
              <p className="text-muted-foreground">
                Create, format, and publish your blogs with our intuitive rich
                text editor. Your words, your style — no tech barriers.
              </p>
            </div>

            <div>
              <h3 className="mb-2 text-xl font-medium flex items-center gap-2">
                <Eye className="size-5 text-primary" /> Blog Discovery
              </h3>
              <p className="text-muted-foreground">
                Explore inspiring posts from other writers, engage with the
                community, and grow your audience organically.
              </p>
            </div>

            <div>
              <h3 className="mb-2 text-xl font-medium flex items-center gap-2">
                <Mail className="size-5 text-primary" /> Email Signatures
              </h3>
              <p className="text-muted-foreground">
                Design and host professional email signatures directly from our
                app, ready to share or use anytime.
              </p>
            </div>

            <div>
              <h3 className="mb-2 text-xl font-medium flex items-center gap-2">
                <Users className="size-5 text-primary" /> Creator Community
              </h3>
              <p className="text-muted-foreground">
                Connect with like-minded writers, collaborate on ideas, and
                support each other’s growth.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
